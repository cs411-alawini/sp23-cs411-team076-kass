import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import pandas as pd
import plotly.graph_objects as go
import pycountry
import requests
from pycountry_convert import country_name_to_country_alpha3
from flask_cors import CORS

url = "http://35.209.21.140:8000/sports_participants"
data = requests.get(url).json()["sports_participants"]
df = pd.DataFrame(data)


def get_iso3(country_name):
    if country_name == "ROC":
        return "RUS"
    elif country_name == "Peoples Republic of China":
        return "CHN"
    try:
        iso3 = country_name_to_country_alpha3(country_name)
    except KeyError:
        iso3 = ""
    return iso3


app = dash.Dash(__name__)
CORS(app.server)

app.layout = html.Div(
    [
        html.H1("Athlete Participation"),
        html.Label("Country"),
        dcc.Dropdown(
            id="country",
            options=[{"label": c, "value": c} for c in df["country"].unique()],
            value=None,
            multi=False,
            placeholder="Select a Country",
        ),
        html.Label("Sport"),
        dcc.Dropdown(
            id="sport",
            options=[{"label": s, "value": s} for s in df["sport"].unique()],
            value=None,
            multi=False,
            placeholder="Select a Sport",
        ),
        dcc.Graph(id="choropleth-map"),
    ]
)


@app.callback(
    Output("choropleth-map", "figure"),
    Input("country", "value"),
    Input("sport", "value"),
)
def update_graph(country_value, sport_value):
    filtered_df = df.copy()

    if country_value:
        filtered_df = filtered_df[filtered_df["country"] == country_value]

    if sport_value:
        filtered_df = filtered_df[filtered_df["sport"] == sport_value]

    country_counts = filtered_df["country"].value_counts().reset_index()
    country_counts.columns = ["country", "count"]
    country_counts["iso3"] = country_counts["country"].apply(get_iso3)
    country_counts = country_counts.dropna(subset=["iso3"])

    fig = go.Figure(
        data=go.Choropleth(
            locations=country_counts["iso3"],
            z=country_counts["count"],
            text=country_counts["country"],
            colorscale="Viridis",
            autocolorscale=False,
            reversescale=True,
            marker_line_color="darkgray",
            marker_line_width=0.5,
            colorbar_title="Number of Athletes",
        )
    )

    fig.update_layout(
        title_text="Number of Athletes per Country",
        geo=dict(
            showframe=False, showcoastlines=False, projection_type="equirectangular"
        ),
        margin=dict(l=20, r=20, t=40, b=20),
    )

    return fig


if __name__ == "__main__":
    app.run_server(debug=True, host="35.209.21.140", port=8051)