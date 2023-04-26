import pandas as pd
import requests
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import plotly.graph_objects as go
from flask_cors import CORS

url = "http://35.209.21.140:8000/sports_participants"
data = requests.get(url).json()["sports_participants"]
df = pd.DataFrame(data)

app = dash.Dash(__name__)
CORS(app.server)

app.layout = html.Div(
    [
        html.Div(
            [
                html.Label("Country:"),
                dcc.Dropdown(
                    id="country_dropdown",
                    options=[
                        {"label": country, "value": country}
                        for country in df["country"].unique()
                    ],
                    value=None,
                    multi=False,
                    placeholder="Select a country",
                ),
            ]
        ),
        html.Div(
            [
                html.Label("Sport:"),
                dcc.Dropdown(
                    id="sport_dropdown",
                    options=[
                        {"label": sport, "value": sport}
                        for sport in df["sport"].unique()
                    ],
                    value=None,
                    multi=False,
                    placeholder="Select a sport",
                ),
            ]
        ),
        dcc.Graph(id="graph"),
    ]
)


@app.callback(
    Output("graph", "figure"),
    [
        Input("country_dropdown", "value"),
        Input("sport_dropdown", "value"),
    ],
)
def update_graph(country_value, sport_value):
    filtered_df = df.copy()

    if country_value:
        filtered_df = filtered_df[filtered_df["country"] == country_value]

    if sport_value:
        filtered_df = filtered_df[filtered_df["sport"] == sport_value]

    fig = go.Figure()

    for index, row in filtered_df.iterrows():
        fig.add_trace(
            go.Scatter(
                x=[row["athlete"]],
                y=[row["sport"]],
                mode="markers+text",
                text=row["athlete"],
                hovertext=row["athlete"],
                showlegend=False,
                textposition="top center",
                marker=dict(size=20, color="blue"),
            )
        )

    for country in filtered_df["country"].unique():
        fig.add_trace(
            go.Scatter(
                x=[country],
                y=["Country"],
                mode="markers+text",
                text=country,
                hovertext=country,
                showlegend=False,
                textposition="top center",
                marker=dict(size=25, color="red"),
            )
        )

    for sport in filtered_df["sport"].unique():
        fig.add_trace(
            go.Scatter(
                x=[sport],
                y=["Sport"],
                mode="markers+text",
                text=sport,
                hovertext=sport,
                showlegend=False,
                textposition="top center",
                marker=dict(size=25, color="green"),
            )
        )

    for index, row in filtered_df.iterrows():
        fig.add_trace(
            go.Scatter(
                x=[row["country"], row["athlete"]],
                y=["Country", row["sport"]],
                mode="lines",
                showlegend=False,
                line=dict(width=1, color="gray"),
            )
        )

    for index, row in filtered_df.drop_duplicates(
        subset=["country", "sport"]
    ).iterrows():
        fig.add_trace(
            go.Scatter(
                x=[row["country"], row["sport"]],
                y=["Country", "Sport"],
                mode="lines",
                showlegend=False,
                line=dict(width=1, color="gray"),
            )
        )

    fig.update_layout(
        margin=dict(l=20, r=20, t=20, b=20),
        paper_bgcolor="white",
        plot_bgcolor="white",
        xaxis=dict(showgrid=False, zeroline=False, showticklabels=True),
        yaxis=dict(showgrid=False, zeroline=False, showticklabels=True),
    )

    return fig


if __name__ == "__main__":
    app.run_server(debug=True, host="35.209.21.140", port=8050)