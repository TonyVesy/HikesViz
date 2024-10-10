# Define a function to convert the 'moving_time' to total seconds
import re
import pandas as pd

data=pd.read_csv('clean.csv')

def time_to_hours(time_str):
    # Regular expression to match the days, hours, minutes, and seconds
    pattern = r"(?:(\d+)\s+days?)?\s*(\d+):(\d+):(\d+)"
    match = re.match(pattern,time_str)
    
    if match:
        days = int(match.group(1)) if match.group(1) else 0
        hours = int(match.group(2))
        minutes = int(match.group(3))
        seconds = int(match.group(4))
        
        total_hours = days * 24 + hours + (minutes+ seconds/60) / 60
        return total_hours
    else:
        return None

data.dropna(subset=['duration'], inplace=True)
#Apply the conversion to the 'moving_time' column
data['moving_time_hours'] = data['moving_time_seconds']
data['duration_hours'] = data['duration'].apply(time_to_hours)



# Save the cleaned data to a new CSV file for D3.js
data.to_csv('Hikes_CP4.csv')

