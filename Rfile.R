##setwd("C:/Users/John/Documents/GitHub/CIS550Project/parsed")
setwd("C:/Retrosheet/data/parsed")
install.packages("RMySQL")
library(data.table)
library(RMySQL)
db=dbConnect(MySQL(), user="johngeyer", password="10370Buxton!", host="baseballdata.cu9ww8beiiup.us-east-2.rds.amazonaws.com", port=3306, db="CIS550")

## Read in event files: 

kept.columns=c(1:3, 5:7, 13:15, 17:18, 31:40, 42:44, 48:50, 98:100)
kept.names=c("GAME_ID", "AWAY_TEAM_ID", "INN_CT", "OUTS_CT", "BALLS_CT", "STRIKES_CT", "BAT_ID", "BAT_HAND", "PITCHER_ID", "RES_PITCH_ID", "RES_PITCH_HAND", "LEADOFF_FL", "PH_FL", "POS_ID", "LINEUP_ID", "EVENT_ID", "BAT_EVENT_FL", "AB_FL", "HIT_VAL", "SH_FL", "SF_FL", "DP_FL", "TP_FL", "RBI", "BATTED_BALL_TYPE", "BUNT_FL", "FOUL_FL", "HOME_ID", "BAT_TEAM", "FLD_TEAM")

import.to.database = function(con, prefix, num, tablename, columns, columnnames) {
  to.add=fread(paste(prefix, as.character(num), ".csv", sep=""), select=columns, header=FALSE, col.names=columnnames)
  dbWriteTable(con, tablename, to.add, append=TRUE)
}

events.table = fread("all1952.csv", select=kept.columns, header=FALSE, col.names=kept.names)
dbWriteTable(db, "Events", events.table)
for (i in 1953:2002) {
  import.to.database(db, "all", i, "Events", kept.columns, kept.names)
}

for (i in 2004:2016) {
  import.to.database(db, "all", i, "Events", kept.columns, kept.names)
}


## Read in game files: 


kept.columns.game=c(1,2,8,9,19, 33:46, 93:99, 102:108, 112, 120:124, 127:133, 137)
kept.names.game=c("GAME_ID", "GAME_DATE", "AWAY_TEAM_ID", "HOME_TEAM_ID", "ATTENDANCE", "TIME", "INN_CT", "AWAY_SCORE", "HOME_SCORE", "AWAY_HITS", "HOME_HITS", "AWAY_ERR", "HOME_ERR", "AWAY_LOB", "HOME_LOB", "WIN_PITCH_ID", "LOSE_PITCH_ID", "SAVE_PITCH_ID", "GWRBI_ID", "AWAY_LINE", "HOME_LINE", "AWAY_AB", "AWAY_Doubles", "AWAY_Triples", "AWAY_HR", "AWAY_RBI", "AWAY_HP", "AWAY_BB", "AWAY_IBB", "AWAY_SO", "AWAY_SB", "AWAY_CS", "AWAY_GDP", "AWAY_ERA", "HOME_AB", "HOME_Doubles", "HOME_Triples", "HOME_HR", "HOME_RBI", "HOME_HP", "HOME_BB", "HOME_IBB", "HOME_SO", "HOME_SB", "HOME_CS", "HOME_GDP", "HOME_ERA")
game.table = fread("games1952.csv", select=kept.columns.game, header=FALSE, col.names=kept.names.game, colClasses=c("V93"="character", "V94"="character"))
dbWriteTable(db, "Games", game.table)
for (i in 1953:2002) {
  table=fread(paste("games", i, ".csv", sep=""), select=kept.columns.game, header=FALSE, col.names=kept.names.game, colClasses=c("V93"="character", "V94"="character"))
  dbWriteTable(db, "Games", table, append=TRUE)
}
for (i in 2004:2016) {
  table=fread(paste("games", i, ".csv", sep=""), select=kept.columns.game, header=FALSE, col.names=kept.names.game, colClasses=c("V93"="character", "V94"="character"))
  dbWriteTable(db, "Games", table, append=TRUE)
}

### Read in player biographical info
plr.cols=c(1:4,14,15,17:23)
plr.col.names=c("playerID","birthYear","birthMonth","birthDay","nameFirst","nameLast","weight","height","bats","throws","debut","finalGame","ID")
players=fread("lahman/core/Master.csv", select=plr.cols, header=FALSE, skip=1, col.names=plr.col.names)
players$name = paste(players$nameFirst, players$nameLast)
players$nameFirst=players$name
players$nameLast=NULL
players$name=NULL
colnames(players)[colnames(players) == "nameFirst"] = "name"


team.cols=c(1:3, 7, 9, 10, 15:33, 41, 43, 48)
team.col.names=c("yearID","lgID","teamID","G","W","L","R","AB","H","Doubles","Triples","HR","BB","SO","SB","CS","HBP","SF","RA","ER","ERA","CG","SHO","SV","IPouts","name","attendance","ID")
teams=fread("lahman/core/Teams.csv", select=team.cols, header=FALSE, skip=1, col.names=team.col.names)

batting.cols=c(1,2,3,4,6:22)
batting.col.names=c("playerID", "yearID", "stint", "teamID", "G","AB","R","H","Doubles","Triples","HR","RBI","SB","CS","BB","SO","IBB","HBP","SH","SF","GIDP")
batting=fread("lahman/core/Batting.csv", select=batting.cols, header=FALSE, skip=1, col.names=batting.col.names)
head(batting)

salary.cols=c(1,2,4,5)
salary=fread("lahman/core/Salaries.csv", select=salary.cols, header=TRUE)

pitching.cols=c(1,2,3,4,6:30)
pitching=fread("lahman/core/Pitching.csv", select=pitching.cols, header=TRUE)


## make sure we only use RetroID, not LahmanID for players
merged.batting=merge(batting, players, by.x="playerID", by.y="playerID")
merged.batting$playerID=merged.batting$ID
batting=subset.data.frame(merged.batting, select=c(1:21))

merged.pitching=merge(pitching, players, by.x="playerID", by.y="playerID")
merged.pitching$playerID=merged.pitching$ID
pitching=subset(merged.pitching, select=c(1:29))

merged.salary=merge(salary, players, by.x="playerID", by.y="playerID")
merged.salary$playerID=merged.salary$ID
salary=subset(merged.salary, select=c(1:4))

## make sure we only use RetroID, not LahmanID for teams

teams.ids=subset(teams, select=c(1,3,28))
merged.batting.teams=merge(batting, teams.ids, by.x=c("teamID", "yearID"), by.y=c("teamID", "yearID"))
merged.batting.teams$teamID=merged.batting.teams$ID
batting=subset(merged.batting.teams, select=c(1:length(batting)))

merged.pitching.teams=merge(pitching, teams.ids, by.x=c("teamID", "yearID"), by.y=c("teamID", "yearID"))
merged.pitching.teams$teamID=merged.pitching.teams$ID
pitching=subset(merged.pitching.teams, select=c(1:length(pitching)))

merged.salary.teams=merge(salary, teams.ids, by.x=c("teamID", "yearID"), by.y=c("teamID", "yearID"))
merged.salary.teams$teamID=merged.salary.teams$ID
salary=subset(merged.salary.teams, select=c(1:4))

temp=players$playerID
players$playerID=players$ID
players.to.import=subset(players, select=c(1:12))

temp2=teams$teamID
teams$teamID=teams$ID
teams.to.import=subset(teams, select=c(1:27))

### Now all data uses retro-sheet identifications for teams and players


dbWriteTable(db, "Batting", batting)
dbWriteTable(db, "Pitching", pitching)
dbWriteTable(db, "Players", players.to.import)
dbWriteTable(db, "Salary", salary)
dbWriteTable(db, "Teams", teams.to.import)


dbDisconnect(db)


