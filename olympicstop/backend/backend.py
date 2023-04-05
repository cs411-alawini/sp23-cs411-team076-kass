from flask import Flask, jsonify, request
import pymysql
from flask_cors import CORS
from google.cloud.sql.connector import Connector

connector = Connector()
conn: pymysql.connections.Connection = connector.connect(
    "artful-fastness-379721:us-central1:cs411-team76-stage3",
    "pymysql",
    user="root",
    password="KASS1234",
    db="CS411"
)

app = Flask(__name__)
CORS(app)

@app.route("/add_athlete", methods=["POST"])
def add_athlete():
    data = request.get_json()
    if not data or "name" not in data or "country_name" not in data or "sport_name" not in data:
        return jsonify({"error": "Required fields are missing"}), 400
    name = data["name"].strip()
    country_name = data["country_name"].strip()
    coach_name = data.get("coach_name")  # Optional 
    sport_name = data["sport_name"].strip()
    cursor = conn.cursor()
    cursor.execute("SELECT ID FROM Country WHERE TRIM(NAME) = %s", (country_name,))
    country_id = cursor.fetchone()
    if not country_id:
        cursor.close()
        return jsonify({"error": f"Invalid country_name '{country_name}'"}), 404
    cursor.execute("SELECT ID FROM Sport WHERE TRIM(NAME) = %s", (sport_name,))
    sport_id = cursor.fetchone()
    if not sport_id:
        cursor.close()
        return jsonify({"error": f"Invalid sport_name '{sport_name}'"}), 404
    if coach_name is not None:
        coach_name = coach_name.strip()
        cursor.execute("SELECT ID FROM Coach WHERE TRIM(NAME) = %s", (coach_name,))
        coach_id = cursor.fetchone()
        if not coach_id:
            cursor.close()
            return jsonify({"error": f"Invalid coach_name '{coach_name}'"}), 404
    else:
        coach_id = None
    cursor.execute("""
        INSERT INTO Athlete (NAME, COUNTRYID, COACHID)
        VALUES (%s, %s, %s)
    """, (name, country_id[0], coach_id[0] if coach_id else None))
    cursor.execute("SELECT LAST_INSERT_ID()")
    athlete_id = cursor.fetchone()[0]
    cursor.execute("""
        INSERT INTO Plays (ATHLETEID, SPORTID)
        VALUES (%s, %s)
    """, (athlete_id, sport_id[0]))
    conn.commit()
    cursor.close()
    return jsonify({"success": f"Athlete '{name}' has been added and linked to sport '{sport_name}'"})

@app.route("/delete_athlete", methods=["DELETE"])
def delete_athlete():
    data = request.get_json()
    if not data or ("id" not in data and "name" not in data):
        return jsonify({"error": "At least one required field (id or name) is missing"}), 400
    athlete_id = data.get("id", None)
    athlete_name = data.get("name", None)
    cursor = conn.cursor()
    if athlete_id:
        delete_condition = "ID = %s"
        delete_params = (athlete_id,)
    else:
        delete_condition = "NAME = %s"
        delete_params = (athlete_name,)
    cursor.execute(f"DELETE FROM Plays WHERE ATHLETEID IN (SELECT ID FROM Athlete WHERE {delete_condition})", delete_params)
    deleted_rows = cursor.execute(f"DELETE FROM Athlete WHERE {delete_condition}", delete_params)
    conn.commit()
    cursor.close()
    if deleted_rows > 0:
        return jsonify({"success": f"Athlete {'with ID ' + str(athlete_id) if athlete_id else 'named ' + athlete_name} and associated records have been deleted"})
    else:
        return jsonify({"error": f"No athlete found {'with ID ' + str(athlete_id) if athlete_id else 'named ' + athlete_name}"}), 404

@app.route("/search_athlete/<string:search_term>")
def search_athlete(search_term):
    cursor = conn.cursor()
    cursor.execute('''
        SELECT Athlete.NAME as Athlete, Sport.NAME as Sport, Country.NAME as Country, Coach.NAME as Coach
        FROM Athlete
        JOIN Plays ON Athlete.ID = Plays.ATHLETEID
        JOIN Sport ON Plays.SPORTID = Sport.ID
        JOIN Country ON Athlete.COUNTRYID = Country.ID
        LEFT JOIN Coach ON Athlete.COACHID = Coach.ID
        WHERE Athlete.NAME LIKE %s
        ORDER BY Athlete.NAME;
    ''', ('%' + search_term + '%',))
    results = cursor.fetchall()
    search_results = []
    for result in results:
        search_results.append({
            "athlete": result[0],
            "sport": result[1],
            "country": result[2],
            "coach": result[3] if result[3] else None
        })
    response = {"search_results": search_results}
    cursor.close()
    return jsonify(response)

@app.route("/update_medals", methods=["POST"])
def update_medals():
    data = request.get_json()
    if not data or "country" not in data or "gold" not in data or "silver" not in data or "bronze" not in data:
        return jsonify({"error": "Required fields are missing"}), 400
    country = data["country"].rstrip('\r').strip()
    gold = data["gold"]
    silver = data["silver"]
    bronze = data["bronze"]
    cursor = conn.cursor()
    cursor.execute("SELECT ID FROM Country WHERE TRIM(NAME) = %s", (country,))
    country_id = cursor.fetchone()
    if not country_id:
        cursor.close()
        return jsonify({"error": f"Country '{country}' not found"}), 404
    updated_rows = cursor.execute("""
        UPDATE Medals
        SET GOLD = %s, SILVER = %s, BRONZE = %s, TOTAL = %s
        WHERE COUNTRYID = %s
    """, (gold, silver, bronze, gold + silver + bronze, country_id[0]))
    conn.commit()
    cursor.close()
    if updated_rows > 0:
        return jsonify({"success": f"Medal count for '{country}' successfully updated"})
    else:
        return jsonify({"error": f"No changes made for '{country}'"}), 400

@app.route("/ranking")
def get_ranking():
    cursor = conn.cursor()
    cursor.execute('''
        SELECT TRIM(Country.NAME), SUM(Medals.GOLD), SUM(Medals.SILVER), SUM(Medals.BRONZE)
        FROM Country
        JOIN Medals ON Country.ID = Medals.COUNTRYID
        JOIN Plays ON Medals.COUNTRYID = Plays.ATHLETEID
        JOIN Sport ON Plays.SPORTID = Sport.ID
        GROUP BY Country.NAME
        ORDER BY SUM(Medals.TOTAL) DESC
        LIMIT 15
    ''')
    results = cursor.fetchall()
    ranking = []
    for result in results:
        ranking.append({
            "country": result[0].rstrip('\r'),
            "gold": result[1],
            "silver": result[2],
            "bronze": result[3]
        })
    response = {"ranking": ranking}
    cursor.close()
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)