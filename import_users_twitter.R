setwd("C:/Users/John/Documents/GitHub/CIS550Project/")
library(RMySQL)
db=dbConnect(MySQL(), user="johngeyer", password="10370Buxton!", host="baseballdata.cu9ww8beiiup.us-east-2.rds.amazonaws.com", port=3306, db="CIS550")

twitter=read.csv("twitter.csv", header=TRUE)
users=read.csv("users.csv", header=TRUE)

dbWriteTable(db, "twitter", twitter)
dbWriteTable(db, "users", users)

dbDisconnect(db)
