export interface IMatchAlliance {
	score: number,
	dq_team_keys: Array<string>,
	surrogate_team_keys: Array<string>,
	team_keys: Array<string>,
}

export interface IMatchScheduleEntry {
	actual_time: number,
	alliances: {
		blue: IMatchAlliance,
		red: IMatchAlliance
	},
	comp_level: "qm" | "qf" | "sf" | "f",
	event_key: string,
	key: string,
	match_number: number,
	predicted_time: number,
	set_number: 1,
	time: number,
	winning_alliance: "blue" | "red"
}
