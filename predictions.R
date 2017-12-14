setwd("C:/Users/John/Documents/GitHub/CIS550Project/")
install.packages("RMySQL")
library(data.table)
library(RMySQL)
install.packages("dplyr")
install.packages("plyr")
library(dplyr)
library(plyr)
db=dbConnect(MySQL(), user="johngeyer", password="10370Buxton!", host="baseballdata.cu9ww8beiiup.us-east-2.rds.amazonaws.com", port=3306, db="CIS550")

dbGetQuery(db, 'CREATE VIEW active_players AS (SELECT playerID FROM Batting GROUP BY playerID HAVING MAX(yearID) > 2015)')
active=dbGetQuery(db, 'SELECT * FROM Batting NATURAL JOIN active_players')
active_players=dbGetQuery(db, 'SELECT * FROM active_players')
active_players$row_names=NULL

avgs=sapply(active, mean)

projection=function(df) {
  plyr.avgs=sapply(df, mean);
  .5*plyr.avgs + .5*avgs
}

output=data.frame()
seed=c(1:21)
output=rbind(output, seed)
colnames(output)=colnames(active)
for (p in active_players$playerID) {
  df = subset(active, active$playerID==p);
  proj = projection(df);
  output = rbind(output, proj);
  output[length(output$playerID),1]=p;
  output[length(output$playerID),3]=2017;
}
output=output[-1,]

dbWriteTable(db, "Batting", output, append=TRUE)

dbDisconnect(db)
