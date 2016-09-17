import quandl

corporation = "WIKI/" + "googl"
startDate = "2016-09-12"
endDate = "2016-09-12"
quandl.ApiConfig.api_key = 'mSjmVxD7fpFDXBjUsYtT'

data = quandl.get(corporation, trim_start = startDate, trim_end = endDate)

tail = data.tail()

print(tail)