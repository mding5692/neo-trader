var currTrackedStocks = new Array();
var rateOfReturn = 0;

function setRateOfReturn(ror) {
	rateOfReturn = ror;
}

function addStockToTrackedStocks(ticker) {
	var stockInfo = {
		"ticker": ticker
	};
	var url = "https://www.quandl.com/api/v3/datasets/WIKI/" + ticker + ".json?api_key=mSjmVxD7fpFDXBjUsYtT";
	$.ajax({
		url: url,
		success: function(data) {
			var currStockPrice = data.dataset.data[0][1];
			stockInfo.currPrice = currStockPrice;
			var stockPrice2YearsAgo = data.dataset.data[600][1];
			var growthRate = (currStockPrice - stockPrice2YearsAgo) / stockPrice2YearsAgo;
			stockInfo.growthRate = Math.round(growthRate * 100);
			currTrackedStocks.push(stockInfo);
			console.log(stockInfo);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function getStockGrowthRate(stockInfo) {
	return stockInfo.growthRate;
}

function removeStocksNotInAcceptableRange(stock) {
	var acceptableRateOfReturnRangeMax = rateOfReturn + 8;
	var acceptableRateOfReturnRangeMin = rateOfReturn - 8;
	return (getStockGrowthRate(stock) < acceptableRateOfReturnRangeMax && getStockGrowthRate(stock) > acceptableRateOfReturnRangeMin)
}

function recommendFromCurrTrackedStocks() {
	var recommendedStocks = currTrackedStocks;
	recommendedStocks.filter(removeStocksNotInAcceptableRange);
	console.log(recommendedStocks);
}

function createLink(command) {
  var url = "https://api.projectoxford.ai/luis/v1/application/preview?id=526f6452-0231-4bef-afa5-a8c3c63d470e&subscription-key=baa34ae8054649a49229e587e3eff446&q=";
  var commandArray = command.split(" ");
  for each (word in commandArray) {
    url.concat(word + "%20");
  }
  return url
}

$(document).ready(function() {
	setRateOfReturn(30);
	addStockToTrackedStocks("MSFT");
	addStockToTrackedStocks("IBM");
	addStockToTrackedStocks("YHOO");
	addStockToTrackedStocks("FB");
	recommendFromCurrTrackedStocks()
});
