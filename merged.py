import json

# Load the two JSON timetables
with open('class.json', 'r') as f1, open('new-courses.json', 'r') as f2:
    timetable1 = json.load(f1)
    timetable2 = json.load(f2)

# Merge function
def merge_timetables(t1, t2):
    merged = dict(t1)  # shallow copy

    for day, slots in t2.items():
        if day not in merged:
            merged[day] = dict(slots)
        else:
            for slot, classes in slots.items():
                if slot not in merged[day]:
                    merged[day][slot] = list(classes)
                else:
                    merged[day][slot].extend(classes)

    return merged

# Merge and save
merged = merge_timetables(timetable1, timetable2)

with open('merged.json', 'w') as f:
    json.dump(merged, f, indent=2)

print("✅ Merged timetable saved to merged.json")
