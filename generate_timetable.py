
import json

def get_empty_schedule():
    times = [
        "8:00-8:30", "8:30-9:00", "9:00-9:30", "9:30-10:00", "10:00-10:30", "10:30-11:00",
        "11:00-11:30", "11:30-12:00", "12:00-12:30", "12:30-1:00", "1:00-1:30", "1:30-2:00",
        "2:00-2:30", "2:30-3:00", "3:00-3:30", "3:30-4:00", "4:00-4:30", "4:30-5:00",
        "5:00-5:30", "5:30-6:00", "6:00-6:30", "6:30-7:00", "7:00-7:30"
    ]
    return {t: [] for t in times}

data = {
    "Monday": get_empty_schedule(),
    "Tuesday": get_empty_schedule(),
    "Wednesday": get_empty_schedule(),
    "Thursday": get_empty_schedule(),
    "Friday": get_empty_schedule()
}

# Helper to add course to time range
def add_course(day, start_time, end_time, course_id, classroom, class_type="class"):
    times = [
        "8:00-8:30", "8:30-9:00", "9:00-9:30", "9:30-10:00", "10:00-10:30", "10:30-11:00",
        "11:00-11:30", "11:30-12:00", "12:00-12:30", "12:30-1:00", "1:00-1:30", "1:30-2:00",
        "2:00-2:30", "2:30-3:00", "3:00-3:30", "3:30-4:00", "4:00-4:30", "4:30-5:00",
        "5:00-5:30", "5:30-6:00", "6:00-6:30", "6:30-7:00", "7:00-7:30"
    ]
    
    try:
        start_idx = times.index(start_time)
        end_idx = times.index(end_time)
    except ValueError:
        print(f"Time range error: {start_time} - {end_time}")
        return

    entry = {
        "courseId": course_id,
        "classroom": classroom,
        "classType": class_type
    }
    
    # Auto-detect type if generic
    if class_type == "class":
        if "Lab" in classroom or "Lab" in course_id:
            entry["classType"] = "lab"
        elif "Tut" in course_id or "Tut" in classroom:
            entry["classType"] = "tut"

    # Add to all intervals in range [start, end)
    for i in range(start_idx, end_idx):
        t = times[i]
        # Check if already added to avoid duplicates if called multiple times
        if entry not in data[day][t]:
            data[day][t].append(entry)

# Helper to add a batch of courses
def add_slot(day, start, end, courses_list, class_type="class"):
    for c in courses_list:
        add_course(day, start, end, c[0], c[1], class_type)

# Define Course Lists
slot_1 = [
    ("BDMH", "A007"), ("CV", "B003"), ("GT", "C210"), ("PDE", "C12"),
    ("FCS", "C21"), ("ASSD", "A106"), ("SML", "C201"), ("MTL", "C11"), ("WN", "B002")
]

slot_2 = [
    ("HMDS", "C211"), ("TPCR", "B001"), ("NPDE", "C212"), ("COT", "A006"),
    ("MUC", "C22"), ("EFD", "C24"), ("VPM", "C201"), ("CF", "C03"),
    ("WCE", "C13"), ("CCT", "C208"), ("NS", "C21")
]

slot_3 = [
    ("IMB", "C211"), ("QO", "B002"), ("AOMML", "C216"), ("NEID", "C03"),
    ("ME", "C213"), ("SGI", "B001"), ("QIT", "C13"), ("AT", "C209"),
    ("PNT", "L1"), ("IQC", "C01"), ("GDD", "Lab 407")
]

slot_4 = [
    ("SDOS", "C102"), ("HAI", "C210"), ("DMMRS", "B002"), ("SICSRSD", "C22"),
    ("LO", "A006"), ("PT", "C211"), ("AST", "C02")
]

slot_5 = [
    ("DSG", "C213"), ("AFCM", "A006"), ("FVE", "A007"), ("NLP", "C11"),
    ("LM", "C01"), ("NMP", "B001"), ("PCCI", "B002"), ("GM", "A106")
]

slot_6 = [
    ("ATP", "A006"), ("ML", "C13"), ("EMDNC", "C21"), ("ET", "B001"),
    ("NSC", "C02"), ("EF", "C208"), ("LAG", "C209"), ("RPM", "A106"),
    ("DIS", "C212"), ("MDT", "A007"), ("CP", "B002")
]

slot_7 = [
    ("ACB", "C210"), ("ToC", "C01"), ("MPPRS", "C209"), ("FOM", "C13"),
    ("ATA", "A106"), ("RS", "C02"), ("AC", "C24"), ("HDSO", "C208"),
    ("ICF", "C12"), ("DAIDP", "C211"), ("CIIPS", "A219")
]

slot_8 = [
    ("DL", "C01"), ("UDXR", "C13"), ("NSS-II", "C22"), ("RKHSA", "C208"),
    ("VCA", "A106"), ("CeB", "C214"), ("SP", "B002"), ("AR", "C212"),
    ("DERM", "B001"), ("STS", "C21")
]

slot_9 = [
    ("DRM", "C13"), ("SSSE", "C02"), ("AELD", "A007"), ("COO", "C11"),
    ("ALA", "C03"), ("AOS", "A006"), ("GRS", "C01")
]

# Monday
add_slot("Monday", "9:30-10:00", "11:00-11:30", slot_1)
add_slot("Monday", "11:00-11:30", "12:30-1:00", slot_2)
add_course("Monday", "1:30-2:00", "2:00-2:30", "EEE", "B003")
add_slot("Monday", "3:00-3:30", "4:30-5:00", slot_3)
add_slot("Monday", "4:30-5:00", "6:00-6:30", slot_4)

# Tuesday
add_slot("Tuesday", "9:30-10:00", "11:00-11:30", slot_5)
add_slot("Tuesday", "11:00-11:30", "12:30-1:00", slot_6)
add_course("Tuesday", "1:00-1:30", "2:00-2:30", "IMB Tut", "C12", "tut")
add_slot("Tuesday", "2:30-3:00", "3:30-4:00", slot_7)
add_slot("Tuesday", "3:30-4:00", "5:00-5:30", slot_8)
add_course("Tuesday", "5:00-5:30", "6:30-7:00", "RM", "C101")

# Wednesday
add_slot("Wednesday", "9:30-10:00", "11:00-11:30", slot_9)
add_slot("Wednesday", "11:00-11:30", "12:30-1:00", slot_2)
add_course("Wednesday", "1:30-2:00", "3:00-3:30", "MPPRS Lab", "Lab nos: 315, 316, 320, 321", "lab") # Spanning 1:30 to 3:00 after shift
add_slot("Wednesday", "3:00-3:30", "4:30-5:00", slot_3)
add_slot("Wednesday", "4:30-5:00", "6:00-6:30", slot_4)

# Thursday
add_slot("Thursday", "9:30-10:00", "11:00-11:30", slot_1)
add_slot("Thursday", "11:00-11:30", "12:30-1:00", slot_6)
add_course("Thursday", "12:30-1:00", "1:30-2:00", "ALA Tut", "C03", "tut")
add_course("Thursday", "12:30-1:00", "1:30-2:00", "GRS Tut", "C01", "tut")
add_slot("Thursday", "2:30-3:00", "3:30-4:00", slot_7)
add_course("Thursday", "3:30-4:00", "5:00-5:30", "NAI", "A006") # Extra course in slot 8 overlap
add_slot("Thursday", "3:30-4:00", "5:00-5:30", slot_8)

# Friday
add_slot("Friday", "9:30-10:00", "11:00-11:30", slot_5)

# Slot 9 special handling for Friday
# DRM (C13), DL Tut (C21), AELD (11:00-1:30) (A007), COO (C11), ALA (C03), SSSE (C02), AOS (A006), GRS (C01)
slot_9_fri = [
    ("DRM", "C13"), ("DL Tut", "C21"), ("COO", "C11"),
    ("ALA", "C03"), ("SSSE", "C02"), ("AOS", "A006"), ("GRS", "C01")
]
add_slot("Friday", "11:00-11:30", "12:30-1:00", slot_9_fri)
add_course("Friday", "11:00-11:30", "1:30-2:00", "AELD", "A007")

add_course("Friday", "12:30-1:00", "2:00-2:30", "Tut TOC", "C03,C13,C22,C24,C208,C209,C214,C215", "tut")
add_course("Friday", "2:00-2:30", "3:00-3:30", "JLang", "C210, C211")
add_course("Friday", "2:30-3:00", "3:00-3:30", "Tut SI", "A006", "tut")
add_course("Friday", "2:30-3:00", "3:00-3:30", "Tut GT", "C212", "tut")

add_course("Friday", "3:00-3:30", "4:30-5:00", "Faculty Meeting Slot", "")
add_course("Friday", "4:00-4:30", "6:00-6:30", "Seminar Slot", "")

print(json.dumps(data, indent=2))

