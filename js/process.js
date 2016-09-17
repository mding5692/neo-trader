var currTrackedStocks = new Array();
var rateOfReturn = 0;

function setRateOfReturn(ror) {
	rateOfReturn = ror;
}

function createLink() {
	$("#form").keydown(function (event) {
		if(event.keyCode == 13) {
			console.log(document.getElementById("form").value);
			alert(document.getElementById("form").value);
			return document.getElementById("form").value;
		}
	})
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

$(document).ready(function() {
	setRateOfReturn(30);
	addStockToTrackedStocks("MSFT");
	addStockToTrackedStocks("IBM");
	addStockToTrackedStocks("YHOO");
	addStockToTrackedStocks("FB");
	recommendFromCurrTrackedStocks()
  createLink();
});
