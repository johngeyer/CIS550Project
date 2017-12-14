setwd("C:/Retrosheet/data/payroll")
library(stringi)
library(data.table)

import.table = function(team.abbr, team.name) {
  j=1
  for (i in c(17)) {
    table.1=fread(paste(team.abbr, i, ".csv", sep=""), sep=',', skip=2, select=c(1,3,6), col.names=c("player_name", "service_time","salary"))
    table.1$team = team.name
    table.1$team_abbr = team.abbr
    table.1=table.1[table.1$salary != "" && table.1$player_name != "",]
    table.1=table.1[!is.na(table.1$service_time),]
    #table.1=table.1[table.1$salary != NULL,]
      #table.1$salary = as.numeric(gsub("[\\$,]", "", table.1$salary))
    table.1=table.1[-nrow(table.1),]
    setDT(table.1)[, c("last", "first") := tstrsplit(table.1$player_name, ", ")]
    #write(paste('MERGE (t:Team {teamID:\"', team.name,'\",abbr:\"', team.abbr,'\"})\n', sep=''), file=paste('./', team.abbr,'_input.cyp', sep=''), append=TRUE)
    for (k in 1:nrow(table.1)) {
      row = table.1[k,]
      lname=row$last
      fname=row$first
      experience=row$service_time
      salary=row$salary
      write(paste('MERGE (p', j,':Player {name:\"', paste(fname, lname), '\"})\n', sep=''), file=paste('./', team.abbr,'_input.cyp', sep=''), append=TRUE)
      write(paste('MERGE (t', j,':Team {teamID:\"', team.name, '\",abbr:\"',team.abbr,'\"})', sep=''), file=paste('./', team.abbr,'_input.cyp', sep=''), append=TRUE)
      write(paste('MERGE (t', j,')-[:PAYS {salary:\"', salary, '\", season:20',i,'}]->(p',j,')', sep=''), file= paste('./', team.abbr,'_input.cyp', sep=''), append=TRUE)
      j = j+1
    }
  }
}

import.table("MIA", "Miami Marlins")


  import.table("ARI", "Arizona Diamondbacks")
  import.table("ATL", "Atlanta Braves")
  import.table("ANA", "LA Angels")
  import.table("BAL", "Baltimore Orioles")
  import.table("BOS", "Boston Red Sox")
  import.table("CHC", "Chicago Cubs")
  import.table("CHW", "Chicago White Sox")
  import.table("CIN", "Cincinnati Reds")
  import.table("CLE", "Cleveland Indians")
  import.table("COL", "Colorado Rockies")
  import.table("DET", "Detroit Tigers")
  import.table("HOU", "Houston Astros")
  import.table("KCR", "Kansas City Royals")
  import.table("LAD", "LA Dodgers")
  import.table("MIL", "Milwaukee Brewers")
  import.table("MIN", "Minnesota Twins")
  import.table("NYM", "NY Mets")
  import.table("NYY", "NY Yankees")
  import.table("OAK", "Oakland Athletics")
  import.table("PHI", "Philadelphia Phillies")
  import.table("PIT", "Pittsburgh Pirates")
  import.table("SDP", "San Diego Padres")
  import.table("SEA", "Seattle Mariners")
  import.table("SFG", "San Francisco Giants")
  import.table("STL", "St. Louis Cardinals")
  import.table("TBR", "Tampa Bay Rays")
  import.table("TEX", "Texas Rangers")
  import.table("TOR", "Toronto Blue Jays")
  import.table("WSN", "Washington Nationals")
