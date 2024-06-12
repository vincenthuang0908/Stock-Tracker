var tickers = JSON.parse(localStorage.getItem('tickers')) || [];
var lastPrices = {};
var counter = 15;

document.addEventListener('DOMContentLoaded', main);

function main(){
  const button = document.getElementById('addButton');
  const ticker = document.getElementById('new-ticker');
  
  button.addEventListener('click', addTicker);
  // addToTickerGrid(ticker.value)
  //setInterval(refreshTime, 1000);
}

function refreshTime(){
  if(counter <= 0){
    counter = 15;
  }

  counter--;
  document.getElementById('counter').innerHTML = counter;
}



function addToTickerGrid(ticker) {
    const tickersGrid = document.getElementById("tickers-grid");
    const tickerBox = document.createElement("div");
    tickerBox.classList.add("stock-box");
    tickerBox.id = "ticker" + ticker;
  
    const tickerHeading = document.createElement("h3");
    tickerHeading.innerText = ticker;
  
    const tickerPrice = document.createElement("p");
    tickerPrice.id = ticker + "-price";
  
    const tickerPercentChange = document.createElement("p");
    tickerPercentChange.id = ticker + "-pct";
  
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.dataset.ticker = ticker;
    removeButton.innerText = "Remove";
  
    tickerBox.appendChild(tickerHeading);
    tickerBox.appendChild(tickerPrice);
    tickerBox.appendChild(tickerPercentChange);
    tickerBox.appendChild(removeButton);
  
    tickersGrid.appendChild(tickerBox);
  }
  
