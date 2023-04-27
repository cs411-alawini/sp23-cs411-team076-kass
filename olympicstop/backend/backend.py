from flask import Flask, jsonify, request
import pymysql
from flask_cors import CORS,cross_origin
import json
from google.cloud.sql.connector import Connector

connector = Connector()
conn: pymysql.connections.Connection = connector.connect(
    "artful-fastness-379721:us-central1:cs411-team76-stage3",
    "pymysql",
    user="root",
    password="KASS1234",
    db="CS411",
)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://35.209.21.140:3000"], "methods": ["GET", "POST", "OPTIONS","DELETE"], "allow_headers": ["Content-Type", "Authorization"]}})
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/medalstats")
def medal_stats():
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT TRIM(Country.NAME), SUM(Medals.GOLD), SUM(Medals.SILVER), SUM(Medals.BRONZE)
        FROM Country
        JOIN Medals ON Country.ID = Medals.COUNTRYID
        GROUP BY Country.NAME
        ORDER BY SUM(Medals.GOLD + Medals.SILVER + Medals.BRONZE) DESC;
    """
    )
    results = cursor.fetchall()
    medal_stats = []
    for result in results:
        medal_stats.append(
            {
                "country": result[0],
                "gold": result[1],
                "silver": result[2],
                "bronze": result[3],
            }
        )
    response = {"medal_stats": medal_stats}
    cursor.close()
    return jsonify(response)


@app.route("/sports_participants")
def get_sports_participants():
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT Sport.NAME as Sport, Country.NAME as Country, Athlete.NAME as Athlete
        FROM Sport
        JOIN Plays ON Sport.ID = Plays.SPORTID
        INNER JOIN Athlete ON Plays.ATHLETEID = Athlete.ID
        INNER JOIN Country ON Athlete.COUNTRYID = Country.ID
        GROUP BY Sport.NAME, Country.NAME, Athlete.ID
        ORDER BY Sport.NAME;
    """
    )
    results = cursor.fetchall()
    sports_participants = []
    for result in results:
        sports_participants.append(
            {"sport": result[0], "country": result[1], "athlete": result[2]}
        )
    response = {"sports_participants": sports_participants}
    cursor.close()
    return jsonify(response)


@app.route("/add_athlete", methods=["POST"])
def add_athlete():
    data = request.get_json()
    if (
        not data
        or "name" not in data
        or "country_name" not in data
        or "sport_name" not in data
    ):
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
    if coach_name:
        coach_name = coach_name.strip()
        cursor.execute("SELECT ID FROM Coach WHERE TRIM(NAME) = %s", (coach_name,))
        coach_id = cursor.fetchone()
        if not coach_id:
            cursor.close()
            return jsonify({"error": f"Invalid coach_name '{coach_name}'"}), 404
    else:
        coach_id = None
    cursor.execute(
        """
        INSERT INTO Athlete (NAME, COUNTRYID, COACHID)
        VALUES (%s, %s, %s)
    """,
        (name, country_id[0], coach_id[0] if coach_id else None),
    )
    cursor.execute("SELECT LAST_INSERT_ID()")
    athlete_id = cursor.fetchone()[0]
    cursor.execute(
        """
        INSERT INTO Plays (ATHLETEID, SPORTID)
        VALUES (%s, %s)
    """,
        (athlete_id, sport_id[0]),
    )
    conn.commit()
    cursor.close()
    return jsonify(
        {
            "success": f"Athlete '{name}' has been added and linked to sport '{sport_name}'"
        }
    )


@app.route("/delete_athlete", methods=["DELETE"])
def delete_athlete():
    data = request.get_json()
    if not data or "id" not in data:
        return jsonify({"error": "Required field (id) is missing"}), 400
    athlete_id = data["id"]
    cursor = conn.cursor()
    delete_condition = "ID = %s"
    delete_params = (athlete_id,)
    cursor.execute(
        f"DELETE FROM Plays WHERE ATHLETEID IN (SELECT ID FROM Athlete WHERE {delete_condition})",
        delete_params,
    )
    deleted_rows = cursor.execute(
        f"DELETE FROM Athlete WHERE {delete_condition}", delete_params
    )
    conn.commit()
    cursor.close()
    if deleted_rows > 0:
        return jsonify(
            {
                "success": f"Athlete with ID {athlete_id} and associated records have been deleted"
            }
        )
    else:
        return jsonify({"error": f"No athlete found with ID {athlete_id}"}), 404


@app.route("/search_athlete/<string:search_term>")
def search_athlete(search_term):
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT Athlete.NAME as Athlete, Sport.NAME as Sport, Country.NAME as Country, Coach.NAME as Coach
        FROM Athlete
        JOIN Plays ON Athlete.ID = Plays.ATHLETEID
        JOIN Sport ON Plays.SPORTID = Sport.ID
        JOIN Country ON Athlete.COUNTRYID = Country.ID
        LEFT JOIN Coach ON Athlete.COACHID = Coach.ID
        WHERE Athlete.NAME LIKE %s
        ORDER BY Athlete.NAME;
    """,
        ("%" + search_term + "%",),
    )
    results = cursor.fetchall()
    search_results = []
    for result in results:
        search_results.append(
            {
                "athlete": result[0],
                "sport": result[1],
                "country": result[2],
                "coach": result[3] if result[3] else None,
            }
        )
    response = {"search_results": search_results}
    cursor.close()
    return jsonify(response)


@app.route("/search_athlete1/<string:search_term>")
def search_athlete1(search_term):
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT Athlete.ID as AthleteID, Athlete.NAME as Athlete, Sport.NAME as Sport, Country.NAME as Country, Coach.NAME as Coach
        FROM Athlete
        JOIN Plays ON Athlete.ID = Plays.ATHLETEID
        JOIN Sport ON Plays.SPORTID = Sport.ID
        JOIN Country ON Athlete.COUNTRYID = Country.ID
        LEFT JOIN Coach ON Athlete.COACHID = Coach.ID
        WHERE Athlete.NAME LIKE %s
        ORDER BY Athlete.NAME;
    """,
        ("%" + search_term + "%",),
    )
    results = cursor.fetchall()
    search_results = []
    for result in results:
        search_results.append(
            {
                "id": result[0],
                "athlete": result[1],
                "sport": result[2],
                "country": result[3],
                "coach": result[4] if result[4] else None,
            }
        )
    response = {"search_results": search_results}
    cursor.close()
    return jsonify(response)


@app.route("/update_medals", methods=["POST"])
def update_medals():
    data = request.get_json()
    if (
        not data
        or "country" not in data
        or "gold" not in data
        or "silver" not in data
        or "bronze" not in data
    ):
        return jsonify({"error": "Required fields are missing"}), 400
    country = data["country"].rstrip("\r").strip()
    gold = int(data["gold"])
    silver = int(data["silver"])
    bronze = int(data["bronze"])
    cursor = conn.cursor()
    cursor.execute("SELECT ID FROM Country WHERE TRIM(NAME) = %s", (country,))
    country_id = cursor.fetchone()
    if not country_id:
        cursor.close()
        return jsonify({"error": f"Country '{country}' not found"}), 404
    updated_rows = cursor.execute(
        """
        UPDATE Medals
        SET GOLD = %s, SILVER = %s, BRONZE = %s
        WHERE COUNTRYID = %s
    """,
        (gold, silver, bronze, country_id[0]),
    )
    conn.commit()
    cursor.close()
    if updated_rows > 0:
        return jsonify({"success": f"Medal count for '{country}' successfully updated"})
    else:
        return jsonify({"error": f"No changes made for '{country}'"}), 400

@app.route("/ranking1")
def get_ranking1():
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT TRIM(Country.NAME), SUM(Medals.TOTAL)
            FROM Country
            JOIN Medals ON Country.ID = Medals.COUNTRYID
            JOIN Plays ON Medals.COUNTRYID = Plays.ATHLETEID
            JOIN Sport ON Plays.SPORTID = Sport.ID
            GROUP BY Country.NAME
            ORDER BY SUM(Medals.TOTAL) DESC
            """
        )
        results = cursor.fetchall()
        ranking1 = [
            {"country": result[0].rstrip("\r"), "total": result[1]}
            for result in results
        ]
    response = {"ranking1": ranking1}
    return jsonify(response)


@app.route("/ranking")
def get_ranking():
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT TRIM(Country.NAME), SUM(Medals.GOLD), SUM(Medals.SILVER), SUM(Medals.BRONZE)
            FROM Country
            JOIN Medals ON Country.ID = Medals.COUNTRYID
            JOIN Plays ON Medals.COUNTRYID = Plays.ATHLETEID
            JOIN Sport ON Plays.SPORTID = Sport.ID
            GROUP BY Country.NAME
            ORDER BY SUM(Medals.TOTAL) DESC
            LIMIT 15
            """
        )
        results = cursor.fetchall()
        ranking = [
            {
                "country": result[0].rstrip("\r"),
                "gold": result[1],
                "silver": result[2],
                "bronze": result[3],
            }
            for result in results
        ]
    response = {"ranking": ranking}
    return jsonify(response)



def adding_trigger(conn):
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TRIGGER UpdateTotal BEFORE UPDATE ON Medals
        FOR EACH ROW
        BEGIN
          IF (NEW.GOLD <> OLD.GOLD) OR (NEW.SILVER <> OLD.SILVER) OR (NEW.BRONZE <> OLD.BRONZE) THEN
            SET NEW.TOTAL = NEW.GOLD + NEW.SILVER + NEW.BRONZE;
          END IF;
        END;
        """
    )
    conn.commit()
    cursor.close()


def dropping_trigger(conn):
    cursor = conn.cursor()
    cursor.execute("DROP TRIGGER IF EXISTS UpdateTotal;")
    conn.commit()
    cursor.close()


@app.route("/add_trigger", methods=["POST"])
def add_trigger():
    adding_trigger(conn)
    return jsonify({"success": "Adding trigger here"})


@app.route("/drop_trigger", methods=["POST"])
def drop_trigger():
    dropping_trigger(conn)
    return jsonify({"success": "Trigger dropped successfully"})


def create_stored_procedure():
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM information_schema.routines
        WHERE routine_schema = 'CS411' AND routine_name = 'GetFilteredSportsParticipants'
    """
    )
    stored_procedure_exists = cursor.fetchone()[0] > 0
    if not stored_procedure_exists:
        cursor.execute(
            """
            CREATE PROCEDURE GetFilteredSportsParticipants(IN sport_name VARCHAR(100), IN country_name VARCHAR(100))
            BEGIN
                DECLARE done INT DEFAULT FALSE;
                DECLARE cur CURSOR FOR
                    SELECT Sport.NAME as Sport, Country.NAME as Country, Athlete.NAME as Athlete
                    FROM Sport
                    JOIN Plays ON Sport.ID = Plays.SPORTID
                    INNER JOIN Athlete ON Plays.ATHLETEID = Athlete.ID
                    INNER JOIN Country ON Athlete.COUNTRYID = Country.ID
                    WHERE (Sport.NAME = sport_name OR sport_name = '')
                      AND (Country.NAME = country_name OR country_name = '')
                    GROUP BY Sport.NAME, Country.NAME, Athlete.ID
                    ORDER BY Sport.NAME;
                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

                OPEN cur;
                read_loop: LOOP
                    FETCH cur INTO sport_name, country_name, athlete_name;

                    IF done THEN
                        LEAVE read_loop;
                    END IF;
                END LOOP;
                CLOSE cur;
            END
        """
        )
    cursor.close()


@app.route("/filtered_sports_participants")
def get_filtered_sports_participants():
    sport_name = request.args.get("sport", "")
    country_name = request.args.get("country", "")
    create_stored_procedure()
    cursor = conn.cursor()
    cursor.callproc("GetFilteredSportsParticipants", (sport_name, country_name))
    results = cursor.fetchall()
    sports_participants = [
        {"sport": result[0], "country": result[1], "athlete": result[2]}
        for result in results
    ]
    response = {"sports_participants": sports_participants}
    cursor.close()
    return jsonify(response)



@app.route("/sports_and_countries")
def get_sports_and_countries():
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT NAME FROM Sport;")
    sports = [row[0] for row in cursor.fetchall()]
    cursor.execute("SELECT DISTINCT NAME FROM Country;")
    countries = [row[0] for row in cursor.fetchall()]

    response = {"sports": sports, "countries": countries}
    cursor.close()
    return jsonify(response)


def create_stored_procedures():
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM information_schema.routines
        WHERE routine_schema = 'CS411' AND routine_name = 'GetTotalAthletesPerSport'
    """
    )
    sp_exists = cursor.fetchone()[0] > 0
    if not sp_exists:
        cursor.execute(
            """
            CREATE PROCEDURE GetTotalAthletesPerSport()
            BEGIN
                DECLARE done INT DEFAULT FALSE;
                DECLARE sport_name VARCHAR(100);
                DECLARE athlete_count INT;
                DECLARE cur CURSOR FOR
                    SELECT s.NAME as Sport, COUNT(a.ID) as AthleteCount
                    FROM Sport s
                    LEFT JOIN Plays p ON s.ID = p.SPORTID
                    LEFT JOIN Athlete a ON p.ATHLETEID = a.ID
                    WHERE a.ID IN (
                        SELECT Athlete.ID
                        FROM Athlete
                    )
                    GROUP BY s.NAME
                    ORDER BY s.NAME;
                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

                OPEN cur;
                read_loop: LOOP
                    FETCH cur INTO sport_name, athlete_count;

                    IF done THEN
                        LEAVE read_loop;
                    END IF;

                    SELECT sport_name, athlete_count;
                END LOOP;
                CLOSE cur;
            END
        """
        )

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM information_schema.routines
        WHERE routine_schema = 'CS411' AND routine_name = 'GetTotalAthletesPerCountry'
    """
    )
    sp_exists = cursor.fetchone()[0] > 0
    if not sp_exists:
        cursor.execute(
            """
            CREATE PROCEDURE GetTotalAthletesPerCountry()
            BEGIN
                DECLARE done INT DEFAULT FALSE;
                DECLARE country_name VARCHAR(100);
                DECLARE athlete_count INT;
                DECLARE cur CURSOR FOR
                    SELECT c.NAME as Country, COUNT(a.ID) as AthleteCount
                    FROM Country c
                    LEFT JOIN Athlete a ON a.COUNTRYID = c.ID
                    WHERE a.ID IN (
                        SELECT Athlete.ID
                        FROM Athlete
                    )
                    GROUP BY c.NAME
                    ORDER BY c.NAME;
                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

                OPEN cur;
                read_loop: LOOP
                    FETCH cur INTO country_name, athlete_count;

                    IF done THEN
                        LEAVE read_loop;
                    END IF;

                    SELECT country_name, athlete_count;
                END LOOP;
                CLOSE cur;
            END
        """
        )

    cursor.close()


@app.route("/total_athletes_per_country")
def get_total_athletes_per_country():
    create_stored_procedures()
    cursor = conn.cursor()
    cursor.callproc("GetTotalAthletesPerCountry")
    athletes_per_country = []
    while True:
        result = cursor.fetchone()
        if result:
            athletes_per_country.append(
                {"country": result[0], "athlete_count": result[1]}
            )
        elif cursor.nextset():
            continue
        else:
            break
    response = {"athletes_per_country": athletes_per_country}
    cursor.close()
    return jsonify(response)


@app.route("/total_athletes_per_sport")
def get_total_athletes_per_sport():
    create_stored_procedures()
    cursor = conn.cursor()
    cursor.callproc("GetTotalAthletesPerSport")
    athletes_per_sport = []
    while True:
        result = cursor.fetchone()
        if result:
            athletes_per_sport.append({"sport": result[0], "athlete_count": result[1]})
        elif cursor.nextset():
            continue
        else:
            break
    response = {"athletes_per_sport": athletes_per_sport}
    cursor.close()
    return jsonify(response)


@app.route("/schedule", methods=["GET"])
def get_schedule():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM schedule")
    result = cursor.fetchall()
    schedule_stats = []
    for x in result:
        schedule_stats.append(
            {
                "ID": x[0],
                "eventdate": x[1],
                "game": x[2],
                "category": x[3],
                "event": x[4],
                "team": x[5],
                "ticket_count": x[6],
            }
        )
    result = {"schedule_stats": schedule_stats}
    cursor.close()
    return jsonify(result)


@app.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin()
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400
    cursor = conn.cursor()
    cursor.execute("SELECT ID, FIRSTNAME, LASTNAME, EMAIL, PASSWORD FROM Users WHERE USERNAME=%s", (username,))
    user = cursor.fetchone()
    if user is None:
        return jsonify({"msg": "Invalid username or password"}), 401
    stored_password = user[4].strip()
    if password != stored_password:
        return jsonify({"msg": "Invalid username or password"}), 401
    user_info = {
        'id': user[0],
        'firstName': user[1],
        'email': user[3]
    }
    return jsonify(user_info), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
