import pandas as pd
import json

def convert_csv_to_json(csv_file_path, json_file_path):
    # Read the CSV file
    df = pd.read_csv(csv_file_path)

    # Replace NaN values with "Not Available" in the DataFrame
    df = df.fillna("Not Available")

    # List to hold all JSON objects
    json_objects = []

    # Iterate over rows of the DataFrame and convert each row to JSON
    for _, row in df.iterrows():
        # Create a dictionary for the current row
        json_obj = {
            "show_id": row["show_id"],
            "type": row["type"],
            "title": row["title"],
            "director": row["director"],
            "cast": row["cast"].split(", "),
            "country": row["country"],
            "date_added": row["date_added"],
            "release_year": row["release_year"],
            "rating": row["rating"],
            "duration": row["duration"],
            "category": row["listed_in"].split(", "),
            "description": row["description"]
        }
        json_objects.append(json_obj)
    
    # Write the JSON array to the file
    with open(json_file_path, 'w') as file:
        json.dump(json_objects, file)


convert_csv_to_json('netflix_titles.csv', '\outputfile.txt')
