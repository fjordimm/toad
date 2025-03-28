/*
 Description:
  A set of miscellaneous helper functions used throughout the project.
 
 Interactions:
  - used by multiple files (not listed here)
*/

export function stringHash(input: string) {
    let hash: number = 0;

    if (input.length === 0) {
        return hash;
    }

    for (let i = 0; i < input.length; i++) {
        const chr: number = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }

    return hash;
}

const memberColorArray: string[] = [
    "bg-trip_member_col_1",
    "bg-trip_member_col_2",
    "bg-trip_member_col_3",
    "bg-trip_member_col_4",
    "bg-trip_member_col_5",
    "bg-trip_member_col_6",
    "bg-trip_member_col_7",
    "bg-trip_member_col_8",
    "bg-trip_member_col_9",
    "bg-trip_member_col_10",
    "bg-trip_member_col_11",
    "bg-trip_member_col_12",
    "bg-trip_member_col_13",
    "bg-trip_member_col_14",
    "bg-trip_member_col_15"
];

export function indexTo15UniqueColor(index: number) {
    return memberColorArray[index % 15]
}

export function generateUuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
