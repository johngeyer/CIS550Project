setwd("C:/Users/John/Documents/GitHub/CIS550Project/")
library(RMySQL)
db=dbConnect(MySQL(), user="johngeyer", password="10370Buxton!", host="baseballdata.cu9ww8beiiup.us-east-2.rds.amazonaws.com", port=3306, db="CIS550")

dbGetQuery(db, "CREATE INDEX pid ON Batting (playerID(8))")
dbGetQuery(db, "CREATE INDEX pname ON Players (name(10))")
dbDisconnect(db)
