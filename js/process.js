var NLPRecord = new Array();
var stocksRecord = new Array();
var rateOfReturn = 0;
var JSONresponse = {};
var log = new Array();

/*****************Nanture Language Processing********************/
function getInput() {
    log = $('#form').val().split("\n");
    var input = log[log.length - 1];

    if (input === "clear") {
        log = new Array();
        input = ""
        $('#form').val("");
    }
    return input;
}

function createLink(input) {
    var url = "https://api.projectoxford.ai/luis/v1/application/preview?id=526f6452-0231-4bef-afa5-a8c3c63d470e&subscription-key=baa34ae8054649a49229e587e3eff446&q=";
    var inputArray = input.split(" ");
    console.log("link: " + inputArray);
    for (i = 0, len = inputArray.length; i < len; i++) {
        url = url + inputArray[i] + "%20";
    }
    inputArray = new Array();
    return url
}

function NLPTracker(url) {
    $.getJSON(url, function(data) {
        var entities = data.entities;
        if (entities.length !== 0) {
            var entityInfo = {};
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
            NLPRecord.push(entityInfo);
            console.log(entityInfo);
            //setTimeout(function() {
                var ticker = entityInfo.stockName;
                stockTracer(ticker);
            //}, 1000);
        }
    });

}

/**********************Stock Info***********************/
function stockTracer(ticker) {
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
            var stockPrice2YearsAgo = data.dataset.data[600][1];
            var growthRate = (currStockPrice - stockPrice2YearsAgo) / stockPrice2YearsAgo;
            stockInfo.growthRate = Math.round(growthRate * 100);
            console.log(stockInfo);
            stocksRecord.push(stockInfo);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function setRateOfReturn(ror) {
    rateOfReturn = ror;
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


/************************Main*****************************/
$(document).ready(function() {
    setRateOfReturn(30);
    $("#form").keydown(function(event) {
        if (event.keyCode == 13) {
            NLPTracker(createLink(getInput()));
        }
    });
});
