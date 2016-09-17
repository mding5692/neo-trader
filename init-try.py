import quandl

quandl.ApiConfig.api_key = 'mSjmVxD7fpFDXBjUsYtT'

data = quandl.get("WIKI/FB")

tail = data.tail()

print(tail)