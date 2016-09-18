/*
var currTrackedStocks = new Array();
var rateOfReturn = 0;
var cmdLines = new Array();

function setRateOfReturn(ror) {
	rateOfReturn = ror;
}

function createLink() {
	$("#form").keydown(function (event) {
		if(event.keyCode == 13) {
			cmdLines = $('#form').val().split("\n");
			var link = cmdLines[cmdLines.length - 1];

			if (link === "clear"){
				cmdLines =  new Array();
				link = ""
				$('#form').val("");
			}
			//console.log(cmdLines);
			//alert(link);
			return link;
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
*/

var currTrackedStocks = new Array();
var rateOfReturn = 0;
var JSONresponse = {};
var entityInfo = {};
var cmdLines = new Array();
var stock = {};

function setRateOfReturn(ror) {
    rateOfReturn = ror;
}

function addStockToTrackedStocks(ticker) {
    var stockInfo = {
        "ticker": ticker
    };
    var url = "https://www.quandl.com/api/v3/datasets/WIKI/" + ticker + ".json?api_key=mSjmVxD7fpFDXBjUsYtT";
    console.log("the url: " + url);
    $.ajax({
        url: url,
        success: function(data) {
            var currStockPrice = data.dataset.data[0][1];
            stockInfo.currPrice = currStockPrice;
						stock.currPrice = currStockPrice;
            var stockPrice2YearsAgo = data.dataset.data[600][1];
            var growthRate = (currStockPrice - stockPrice2YearsAgo) / stockPrice2YearsAgo;
            stockInfo.growthRate = Math.round(growthRate * 100);
						stock.growthRate = growthRate;
            currTrackedStocks.push(stockInfo);
						if (entityInfo.intent == "get_stock") {
						$("#console").append("Current Stock Price of " + ticker.toUpperCase() + ": " + currStockPrice+ "\nGrowth Rate of " + ticker.toUpperCase() + ": " + stockInfo.growthRate + "\n\n").show();
					}
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
    setTimeout(10000);
    var recommendedStocks = currTrackedStocks;
    recommendedStocks.filter(removeStocksNotInAcceptableRange);
    console.log(recommendedStocks);
}

function predict(name) {
	console.log("predicting---");
	console.log(stock.growthRate);
	setTimeout(function () {
		if (stock.growthRate > 0) {
			$("#console").append(name.toUpperCase() + " is predicted to go up.").show();
		}
		else if (stock.growRate < 0) {
			$("#console").append(name.toUpperCase() + " is predicted to go down.").show();
		}
	}, 1000);

}

function getInput() {
  cmdLines = $('#form').val().split("\n");
  var link = cmdLines[cmdLines.length - 1];

  if (link === "clear"){
    cmdLines =  new Array();
    link = ""
    $('#form').val("");
  }
  //console.log(cmdLines);
  //alert(link);
  return link;
}

function createLink(command) {
    var url = "https://api.projectoxford.ai/luis/v1/application/preview?id=526f6452-0231-4bef-afa5-a8c3c63d470e&subscription-key=baa34ae8054649a49229e587e3eff446&q=";
    var commandArray = command.split(" ");
    console.log("link: " + commandArray);
    for (i = 0, len = commandArray.length; i < len; i++) {
        url = url + commandArray[i] + "%20";
        //console.log(url);
    }
    commandArray = new Array();
    return url
}

function getJSONresponse(url) {
    $.getJSON(url, function(data) {
        JSONresponse.data = data
        console.log("getJSONresponse: " + data.topScoringIntent.intent);
				entityInfo.intent = data.topScoringIntent.intent;
				console.log("intentyy" + entityInfo.intent);
    });
}

function parseJSON() {

    entities = JSONresponse.data.entities;
    console.log("Entities:" + entities);
    for (i = 0; i < entities.length; i++) {
        switch (entities[i].type) {
            case "stock_name":
                entityInfo.stockName = entities[i].entity;
                console.log("entityInfo " + entityInfo.stockName);
                break;
            case "Date::start_date":
                entityInfo.startDate = entities[i].entity;
                break;
            case "Date::end_date":
                entityInfo.endDate = entities[i].entity;
                break;
            case "money":
                entityInfo.money = entities[i].entity;
                break;
            case "want_ROR":
                entityInfo.wantROR = entities[i].entity;
                break;
            case "ROR":
                entityInfo.actualROR = entities[i].entity;
                break;
        }
    }
    // console.log(JSONresponse.data)
        // return JSONresponse.data.entities[0].entity; //get name
}

$(document).ready(function() {
  setRateOfReturn(30);
  $("#form").keydown(function(event) {
    if (event.keyCode == 13) {
      // recommendFromCurrTrackedStocks()
      getJSONresponse(createLink(getInput()));

			console.log("got input");
			console.log("intent" + entityInfo.intent);

			setTimeout(function() {
				switch (entityInfo.intent) {
					// console.log(JSONresponse.data.topScoringIntent.intent);
					case "get_stock":
						setTimeout(function() {
								console.log(parseJSON());
								addStockToTrackedStocks(entityInfo.stockName);
						}, 1000);
						break;
					case "predict_trend":
						console.log("predicting");
						setTimeout(function() {
							addStockToTrackedStocks(entityInfo.stockName);
							predict(entityInfo.stockName);
						}, 1000);
						break;
				}
			}, 1000);
		}
	});
});
