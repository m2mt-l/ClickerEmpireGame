const config = {
    initialPage: document.getElementById("initialPage"),
    mainPage: document.getElementById("mainPage"),
}

class User{
    constructor(name, age, days, money, items){
        this.name = name;
        this.age = age;
        this.days = days;
        this.money = money;
        this.clickCount = 0;
        this.incomePerClick = 25;
        this.incomePerSec = 0;
        this.stock = 0;
        this.items = items
    }
}

class Items{
    constructor(name, type, currentAmount, maxAmount, perMoney, perRate, price, url){
        this.name = name;
        this.type = type;
        this.currentAmount = currentAmount;
        this.maxAmount = maxAmount;
        this.perMoney = perMoney;
        this.perRate = perRate;
        this.price = price;
        this.url = url;
    }   
}

class View{
    static createInitalPage(){
        let container = document.createElement("div");
        container.classList.add("vh-100", "d-flex", "justify-content-center", "align-items-center");
        container.innerHTML =
        `
        <div class="bg-white text-center p-4">
            <h2 class="pb-3">Clicker Empire Game</h2>
            <form>
                <div class="form-row pb-3">
                    <div class="col">
                        <input type="text" class="form-control" placeholder="Your name">
                    </div>
                </div>
            </form>
            <div class="d-flex justify-content-between">
                <div class="col-6 pl-0">
                    <button type="submit" class="btn btn-primary col-12" id="newGame">New</button>
                </div>
                <div class="col-6 pr-0">
                    <button type="submit" class="btn btn-primary col-12" id="login">Login</button>
                </div>
            </div>
        </div>
        `

        return config.initialPage.append(container);
    }

    static createMainPage(user){
        let container = document.createElement("div");
        container.innerHTML =
        `
        <div class="d-flex justify-content-center p-md-5 pb-5">
            <div class="bg-navy p-2 d-flex col-md-11 col-lg-10">
                <div class="bg-dark p-2 col-4" id="burgerStatus">
                </div>

                <div class= "col-8">
                    <div class= "p-1 bg-navy" id="userInfo">  
                    </div>

                    <div class="bg-dark mt-2 p-1 overflow-auto flowHeight" id="displayItems">
                    </div>
                    
                    <div class="d-flex justify-content-end mt-2">
                        <div class="border p-2 mr-2 hover" id="reset">
                            <i class="fas fa-undo fa-2x text-white"></i>
                        </div>
                        <div class="border p-2 hover" id="save">
                            <i class="fas fa-save fa-2x text-white"></i>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
        `
        container.querySelectorAll("#burgerStatus")[0].append(View.createBurgerStatus(user));
        container.querySelectorAll("#userInfo")[0].append(View.createUserInfo(user));
        container.querySelectorAll("#displayItems")[0].append(View.createItemPage(user));

        let resetBtn = container.querySelectorAll("#reset")[0];
        resetBtn.addEventListener("click", function(){
            Controller.resetAllData(user);
        });

        let saveBtn = container.querySelectorAll("#save")[0];
        saveBtn.addEventListener("click", function(){
            Controller.saveUserDate(user);
            Controller.stoptimer();
            Controller.initializePage();            
        })

        return container;
    }

    static createBurgerStatus(user){
        let container = document.createElement("div");
        container.innerHTML =
        `
        <div class="bg-navy text-white text-center">
            <h5>${user.clickCount} Burgers</h5>
            <p>one click ￥${user.incomePerClick} </p>
        </div>
        <div class="p-2 pt-5 d-flex justify-content-center">
            <img src="https://cdn.pixabay.com/photo/2014/04/02/17/00/burger-307648_960_720.png" width=80% class="py-2 hover img-fuid" id="burger">
        </div>    
        `
        let burgerClick = container.querySelectorAll("#burger")[0];
        burgerClick.addEventListener("click", function(){
            Controller.updateByClickBurger(user);
        })

        return container;
    }

    static createUserInfo(user){
        let container = document.createElement("div");
        container.classList.add("d-flex", "flex-wrap", "p-1")
        container.innerHTML =
        `
        <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
            <p>${user.name}</p>
        </div>
        <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
            <p>${user.age} years old</p>
        </div>
        <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
            <p>${user.days} days</p>
        </div>
        <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
            <p>￥${user.money}</p>
        </div>
        `
        return container;
    }


    static createItemPage(user){
        let container = document.createElement("div");
        for(let i = 0; i < user.items.length; i++){
             container.innerHTML +=
             `
            <div class="text-white d-sm-flex align-items-center m-1 selectItem">
                <div class="d-none d-sm-block p-1 col-sm-3">
                    <img src="${user.items[i].url}" class="img-fluid">
                </div>
                <div class="col-sm-9">
                    <div class="d-flex justify-content-between">
                        <h4>${user.items[i].name}</h4>
                        <h4>${user.items[i].currentAmount}</h4>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p>￥${user.items[i].price}</p>
                        <p class="text-success">￥${View.displayItemIncome(user.items[i], user.items[i].type)}</p>
                    </div>
                </div>                      
            </div>
            `   
        }
        let select = container.querySelectorAll(".selectItem");
        for(let i = 0; i < select.length; i++){
            select[i].addEventListener("click", function(){
                config.mainPage.querySelectorAll("#displayItems")[0].innerHTML = '';
                config.mainPage.querySelectorAll("#displayItems")[0].append(View.createPurchasePage(user, i));
            });
        }

        return container;
    }

    static createPurchasePage(user, index){
        let container = document.createElement("div");
        container.innerHTML =
        `
            <div class="bg-navy p-2 m-1 text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h4>${user.items[index].name}</h4>
                            <p>Max purchases: ${View.displayMaxPurchase(user.items[index].maxAmount)}</p>
                            <p>Price: ￥${user.items[index].price}</p>
                            <p>Get ￥${View.displayItemIncome(user.items[index], user.items[index].type)}</p>
                    </div>
                    <div class="p-2 d-sm-block col-sm-5">
                        <img src="${user.items[index].url}" class="img-fluid">
                    </div>
                </div>
                <p>How many would you like to buy?</p>
                <input type="number" placeholder="0" class="col-12 form-control">
                <p class="text-right" id="totalPrice">total: ￥0</p>
                <div class="d-flex justify-content-between">
                    <button class="btn btn-outline-primary col-5 bg-light" id="back">Go Back</buttone>
                    <button class="btn btn-primary col-5" id="purchase">Purchase</buttone>
                </div>
            </div>
        `
        let inputCount = container.querySelectorAll("input")[0];
        inputCount.addEventListener("input", function(){
            container.querySelectorAll("#totalPrice")[0].innerHTML = 
            `
            total: ￥${Controller.getTotalPrice(user.items[index], inputCount.value)}
            `
        });

        let backBtn = container.querySelectorAll("#back")[0];
        backBtn.addEventListener("click", function(){
            View.updateMainPage(user);
        });

        let purchaseBtn = container.querySelectorAll("#purchase")[0];
        purchaseBtn.addEventListener("click", function(){
            Controller.purchaseItems(user, index, inputCount.value);
            View.updateMainPage(user);
        })

        return container;
    }

    static displayMaxPurchase(maxAmount){
        if(maxAmount==-1) return "∞"
        else return maxAmount
    }

    static displayItemIncome(item, type){
        if(type=="ability") return item.perMoney + " /click";
        else if(type=="investment") return item.perRate + " /sec";
        else return item.perMoney + " /sec";
    }

    static updateMainPage(user){
        config.mainPage.innerHTML = '';
        config.mainPage.append(View.createMainPage(user));
    }

    static updateBugurPage(user){
        let burgerStatus = config.mainPage.querySelectorAll("#burgerStatus")[0];
        burgerStatus.innerHTML = '';
        burgerStatus.append(View.createBurgerStatus(user));
    }

    static updateUserInfo(user){
        let userInfo = config.mainPage.querySelectorAll("#userInfo")[0];
        userInfo.innerHTML = '';
        userInfo.append(View.createUserInfo(user));
    }
}


class Controller{
    timer;

    static startGame(){
        View.createInitalPage();
        let newGameBtn = config.initialPage.querySelectorAll("#newGame")[0];            
        newGameBtn.addEventListener("click", function(){
            let userName = config.initialPage.querySelectorAll("input")[0].value;
            if(userName == ""){
                alert("Please put your name");
            } else{
                let user = Controller.createInitialUserAccount(userName);
                Controller.moveInitialToMain(user);
            }
        })

        let loginBtn = config.initialPage.querySelectorAll("#login")[0];
        loginBtn.addEventListener("click", function(){
            let userName = config.initialPage.querySelectorAll("input")[0].value;
            if(userName == ""){
                alert("Please put your name");
            } else{
                let user = Controller.getUserData(userName);
                if(user == null) alert("There is no data.");
                else Controller.moveInitialToMain(user);
            }            
        })
    }

    static moveInitialToMain(user){
        config.initialPage.classList.add("d-none");
        config.mainPage.append(View.createMainPage(user));
        Controller.startTimer(user);
    }

    static createInitialUserAccount(userName){
        let itemsList = [
            new Items("Flip machine", "ability", 0, 500, 25, 0, 15000, "https://cdn.pixabay.com/photo/2019/06/30/20/09/grill-4308709_960_720.png"),
            new Items("ETF Stock", "investment", 0, -1, 0, 0.1, 300000, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png"),
            new Items("ETF Bonds", "investment", 0, -1, 0, 0.07, 300000, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png"),
            new Items("Lemonade Stand", "realState", 0, 1000, 30, 0, 30000, "https://cdn.pixabay.com/photo/2012/04/15/20/36/juice-35236_960_720.png"),
            new Items("Ice Cream Truck", "realState", 0, 500, 120, 0, 100000, "https://cdn.pixabay.com/photo/2020/01/30/12/37/ice-cream-4805333_960_720.png"),
            new Items("House", "realState", 0, 100, 32000, 0, 20000000, "https://cdn.pixabay.com/photo/2016/03/31/18/42/home-1294564_960_720.png"),
            new Items("TownHouse", "realState", 0, 100, 64000, 0, 40000000, "https://cdn.pixabay.com/photo/2019/06/15/22/30/modern-house-4276598_960_720.png"),
            new Items("Mansion", "realState", 0, 20, 500000, 0, 250000000, "https://cdn.pixabay.com/photo/2017/10/30/20/52/condominium-2903520_960_720.png"),
            new Items("Industrial Space", "realState", 0, 10, 2200000, 0, 1000000000, "https://cdn.pixabay.com/photo/2012/05/07/17/35/factory-48781_960_720.png"),
            new Items("Hotel Skyscraper", "realState", 0, 5, 25000000, 0, 10000000000, "https://cdn.pixabay.com/photo/2012/05/07/18/03/skyscrapers-48853_960_720.png"),
            new Items("Bullet-Speed Sky Railway", "realState", 0, 1, 30000000000, 0, 10000000000000, "https://cdn.pixabay.com/photo/2013/07/13/10/21/train-157027_960_720.png")   
        ]
        if(userName=="cheater") return new User(userName, 20, 0, Math.pow(10,9), itemsList)
        return new User(userName, 20, 0, 50000, itemsList);
    }

    static startTimer(user){
        Controller.timer = setInterval(function(){
            user.days++;
            user.money += user.incomePerSec;
            if(user.days % 365 == 0){
                user.age++; 
                View.updateUserInfo(user);
            } else{
                View.updateUserInfo(user);
            }
        },1000);
    }

    static stoptimer(){
        clearInterval(Controller.timer);
    }

    static purchaseItems(user, index, count){
        if(count<=0 || count%1!=0){
            alert("Invalid Number");
        } else if(Controller.getTotalPrice(user.items[index], count) > user.money){
            alert("You don't have enough money.");
        } else if(user.items[index].currentAmount + count > user.items[index].maxAmount && user.items[index].type != "investment"){
            alert("You can't buy anymore.");
        } else{
            user.money -= Controller.getTotalPrice(user.items[index], count);
            user.items[index].currentAmount += Number(count);
            if(user.items[index].name == "ETF Stock"){
                user.stock += Controller.getTotalPrice(user.items[index], count);
                user.items[index].price = Controller.calculateEtfStockPrice(user.items[index], count);
                Controller.updateUserIncome(user, user.items[index], count);
            } else if(user.items[index].name == "ETF Bonds"){
                user.stock += Controller.getTotalPrice(user.items[index], count);
                Controller.updateUserIncome(user, user.items[index], count);
            }else Controller.updateUserIncome(user, user.items[index], count);
        }
    }

    static updateByClickBurger(user){
        user.clickCount++;
        user.money += user.incomePerClick;
        View.updateBugurPage(user);
        View.updateUserInfo(user);
    }

    static getTotalPrice(item, count){
        let total = 0;
        count = Number(count);
        if(item.name == "ETF Stock"){
            for(let i = 0; i < count; i++){
                total += parseInt(item.price * Math.pow(1+item.perRate, i))
            }
            return total;
        } else if(count > 0 && count%1 == 0) return total += item.price * count;
        else return total;
    }

    static calculateEtfStockPrice(item, count){
        return parseInt(item.price * Math.pow(1 + item.perRate, count));
    }

    static updateUserIncome(user, items, count){
        count = Number(count);
        if(items.type == "ability"){
            user.incomePerClick += items.perMoney * count;
        } else if(items.type == "investment"){
            user.incomePerSec += user.stock * items.perRate;
        } else if(items.type == "realState"){
            user.incomePerSec += items.perMoney * count;
        }
    }

    static resetAllData(user){
        if(window.confirm("Reset All Data?")){
            let userName = user.name;
            user = Controller.createInitialUserAccount(userName);
            Controller.stoptimer();
            View.updateMainPage(user);
            Controller.startTimer(user);
        }
    }

    static saveUserDate(user){
        localStorage.setItem(user.name, JSON.stringify(user));
        alert("Saved your data. Please put the same name when you login.");
    }


    static getUserData(userName){
        return JSON.parse(localStorage.getItem(userName));
    }

    static initializePage(){
        config.initialPage.classList.remove("d-none");
        config.initialPage.innerHTML = '';
        config.mainPage.innerHTML = '';
        Controller.startGame();
    }

}

Controller.startGame();



