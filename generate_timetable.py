
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



# B.Tech IV Sem Slots
sem4_orange = [
    ("GT", "C210"), ("PSD", "C02"), ("SML", "C201")
]

sem4_green = [
    ("F&W", "A007"), ("DBMS Sec A", "B003"), ("DBMS Sec B", "C101"), ("SI", "A006")
]

sem4_yellow = [
    ("PCS", "C02"), ("AAI", "B105"), ("PIS", "B003"), ("FBI", "C12")
]

sem4_olive = [
    ("M-IV Sec A", "C01"), ("M-IV Sec B", "C11"), ("IML", "C03"), 
    ("EI", "C102"), ("DIS", "C212"), ("BE", "C101")
]

sem4_blue = [
    ("COO", "C11"), ("ESD", "C101")
]

sem4_ada = [
    ("ADA Sec A", "C101"), ("ADA Sec B", "C102")
]

sem4_elec_1 = [
    ("LO", "A006"), ("ST", "C02"), ("PT", "C211"), ("SICSRS", "C22")
]

sem4_elec_2 = [
    ("ToC", "C01"), ("IE", "A007"), ("ECO", "C21"), ("FOM", "C13")
]

sem4_elec_3 = [
    ("NN", "A007"), ("BP", "A006"), ("SP", "B002"), ("PoE", "B105")
]

# B.Tech IV Sem Schedule

# Monday
add_slot("Monday", "9:30-10:00", "10:30-11:00", sem4_orange)
add_slot("Monday", "11:00-11:30", "12:30-1:00", sem4_green)
add_course("Monday", "1:30-2:00", "2:30-3:00", "Tut AAI", "C24, C208, C209", "tut")
add_course("Monday", "1:30-2:00", "2:30-3:00", "EEE", "B003")
add_course("Monday", "1:00-1:30", "3:00-3:30", "BE Lab", "LHC: 301, 302, 303", "lab")
add_course("Monday", "1:30-2:00", "2:30-3:00", "Tut F&W", "C214, C215, C216", "tut")
add_slot("Monday", "2:30-3:00", "4:00-4:30", sem4_ada)
add_slot("Monday", "4:00-4:30", "5:30-6:00", sem4_elec_1)

# Tuesday
add_slot("Tuesday", "9:30-10:00", "10:30-11:00", sem4_yellow)
add_slot("Tuesday", "11:00-11:30", "12:30-1:00", sem4_olive)
add_course("Tuesday", "1:30-2:00", "2:30-3:00", "ADA Tut", "C101, C201", "tut")
add_slot("Tuesday", "2:30-3:00", "4:00-4:30", sem4_elec_2)
add_slot("Tuesday", "4:00-4:30", "5:30-6:00", sem4_elec_3)

# Wednesday
add_course("Wednesday", "8:30-9:00", "9:30-10:00", "ECO Tut", "C21", "tut")
add_slot("Wednesday", "9:30-10:00", "10:30-11:00", sem4_blue)
add_slot("Wednesday", "11:00-11:30", "12:30-1:00", sem4_green)
add_course("Wednesday", "1:30-2:00", "2:30-3:00", "Tut M-IV", "C12,C13,C22,C24,C208,C209,C214,C215,C216,L1,L2,L3,C210,C211,C212,C213,C02", "tut")
add_course("Wednesday", "1:00-1:30", "3:00-3:30", "BE Lab", "LHC: 301, 302, 303", "lab")
add_slot("Wednesday", "2:30-3:00", "4:00-4:30", sem4_ada)
add_slot("Wednesday", "4:00-4:30", "5:30-6:00", sem4_elec_1)

# Thursday
add_slot("Thursday", "9:30-10:00", "10:30-11:00", sem4_orange)
add_slot("Thursday", "11:00-11:30", "12:30-1:00", sem4_olive)
add_course("Thursday", "1:30-2:00", "2:30-3:00", "DBMS Tut", "C03,C13,C22,C24,C208,C209,C214,C215,C216,L1,L2,L3,C210,C211,C212,C213,C02,C12", "tut")
add_course("Thursday", "1:30-2:00", "2:30-3:00", "Tut PCS", "A007", "tut")
add_course("Thursday", "1:30-2:00", "2:30-3:00", "Tut ESD", "A006", "tut")
add_slot("Thursday", "2:30-3:00", "4:00-4:30", sem4_elec_2)
add_slot("Thursday", "4:00-4:30", "5:30-6:00", sem4_elec_3)

# Friday
add_course("Friday", "8:30-9:00", "9:30-10:00", "Tut BE", "C03,C13,C22,C24,C208,C209,C214,C215,C216", "tut")
add_slot("Friday", "9:30-10:00", "10:30-11:00", sem4_yellow)
add_slot("Friday", "10:30-11:00", "12:30-1:00", sem4_blue)
add_course("Friday", "12:30-1:00", "1:30-2:00", "Tut TOC", "C03,C13,C22,C24,C208,C209,C214,C215", "tut")
add_course("Friday", "2:00-2:30", "2:30-3:00", "Tut SI", "C208,C209,C214,C215", "tut")
add_course("Friday", "2:00-2:30", "3:00-3:30", "Tut GT", "C22,C24", "tut")
add_course("Friday", "2:00-2:30", "2:30-3:00", "Tut IE", "A007", "tut")
add_course("Friday", "2:30-3:00", "4:00-4:30", "Lab IE All Groups", "Lab", "lab")
add_course("Friday", "2:30-3:00", "4:00-4:30", "Lab 302, 303 (LHC)", "LHC", "lab")
add_course("Friday", "2:30-3:00", "4:00-4:30", "Faculty Meeting Slot", "")
add_course("Friday", "4:00-4:30", "5:30-6:00", "Seminar Slot", "")

print(json.dumps(data, indent=2))

