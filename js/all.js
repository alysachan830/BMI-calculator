// 重新命名DOM
const topArea = document.querySelector('.top');
const date = document.querySelector('.resultDate');
const send = document.querySelector('.send');
const weightDOM = document.getElementById('weight');
const heightDOM = document.getElementById('height');
const reminder = document.querySelector('.reminder');
const button = document.querySelector('.send');
const list = document.querySelector('.list');
const clearAllBMI = document.querySelector('.clearAllBMI');
let data = JSON.parse(localStorage.getItem('BMI'))||[];

// 設定日期
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
let yyyy = today.getFullYear();

if(dd<10){
    dd = `0${dd}`;
}

if(mm<10){
    mm = `0${mm}`;
}

let dateStr = `${mm}-${dd}-${yyyy}`

//把所有BMI狀態整合在這裏
const BMIinfo = {
    
    '體重過輕': {
        statusText: '體重過輕',
        color: 'blue'
    },
    '理想':{
        statusText: '理想',
        color: 'green'
    },
    '過重':{
        statusText: '過重',
        color: 'yellow'
    },
    '輕度肥胖':{
        statusText: '輕度肥胖',
        color: 'pink'
    },
    '中度肥胖':{
        statusText: '中度肥胖',
        color: 'red'
    },
    '重度肥胖':{
        statusText: '重度肥胖',
        color: 'brown'
    }
}

renderList();
addDemoText();

//監聽
button.addEventListener('click', checkBtn);
list.addEventListener('click', cancel);
clearAllBMI.addEventListener('click',clearAllData);


function checkBtn(){
    //避免使用者沒有輸入體重或身高
    if(button.classList[2] === 'refresh'){
        clearInput();
    
    }else{
        if(weightDOM.value === '' || heightDOM.value === ''){
            reminder.style.display = 'block'
        }else{
            reminder.style.display = 'none'
            updateList();
        }
    }
}


//判斷數值屬於哪個BMI狀態，並更新data陣列及localStorage
function updateList(){
    const weightInput = parseInt(weightDOM.value);
    const heightInput = parseInt(heightDOM.value);
    const BMIresult = (weightInput / ((heightInput/100) * (heightInput/100))).toFixed(2);
    let statusResult = ''

    if(BMIresult<18.5){
        statusResult = '體重過輕'

    }else if(BMIresult>=18.5 && BMIresult<24){
        statusResult = '理想'
    
    }else if(BMIresult>=24 && BMIresult<27){
        statusResult = '過重'
    
    }else if(BMIresult>=27 && BMIresult<30){
        statusResult = '輕度肥胖'
    
    }else if(BMIresult>=30 && BMIresult<35){
        statusResult = '中度肥胖'
    
    }else if(BMIresult>=35){
        statusResult = '重度肥胖'
    }


    let BMIdata = {
        weight: weightInput,
        height: heightInput,
        BMI: BMIresult,
        status: BMIinfo[statusResult].statusText,
        date: dateStr
    }

    data.push(BMIdata)
    
    localStorage.setItem('BMI', JSON.stringify(data));

    let color = BMIinfo[BMIdata['status']].color

    button.innerHTML = 
    `<p class="btnResult">${BMIdata.BMI}</p>
     <p class="btnBMI">BMI</p>
     <div class="clear ${color}Clear"></div>`

    button.classList.add(`${color}Circle`);
    button.classList.add('refresh');

    renderList();
}

//把資料渲染到網頁上
function renderList(){

    //用data陣列裏的資料組字串，並把組合好的每個字串用join連起來，變成一大堆字串
    let content = data.map( (item,index) => {
        return  `<li class="result ${BMIinfo[item['status']].color}List">
        <span class="resultTitle">${item['status']}</span>

        <div class="resultBMI">
            <span class="resultLabel">BMI</span>
            <span class="resultNum">${item['BMI']}</span>
        </div>
            
        <div class="resultWeight">
            <span class="resultLabel">weight</span>
            <span class="resultNum">${item['weight']}</span>
        </div>
        <div class="resultHeight">
            <span class="resultLabel">height</span>
            <span class="resultNum">${item['height']}</span>
        </div>

        <span class="resultLabel resultDate">${item['date']}</span>
        <a href="#" data-num="${index}" class="cancel"></a>
        </li>`

        
    }).join('')

    list.innerHTML = content;
}

//清空體重和身高輸入值
function clearInput(){
    button.className = 'send';
    button.innerHTML = `看結果`;
    weightDOM.value = '';
    heightDOM.value = '';
}

//刪除資料
function cancel(e){
    e.preventDefault();
    if(e.target.className !== 'cancel'){
        return
    }

    let dataNum = e.target.dataset.num;

    data.splice(dataNum, 1);

    //因為有資料被刪除，所以要更新localStorage及渲染資料
    localStorage.setItem('BMI', JSON.stringify(data));
    renderList();

    //如果把最後一個結果都刪除，就會顯示'請輸入體重和身高'
    if(data.length === 0){
        addDemoText()
    }
}

//當所有資料被刪除時，會在.list加上一段文字
function addDemoText(){    
    if(data.length === 0){
        list.innerHTML = `<p class="instruction">請輸入體重和身高</p>`
    }
}

function clearAllData(){
    data = [];
    //因為有資料被刪除，所以要更新localStorage及渲染資料
    //第2個參數不能寫""，它沒有被加上JSON.stringify轉成JSON String，導致在程式的一開頭用JSON.parse轉換時(JSON.parse(""))會報錯，
    //補充：JSON.stringify("") === "" 是 false。
    //所以這裏第二個參數不能寫""
    //測試過寫JSON.stringify("")也可以，但合理的寫法是JSON.stringify(data)
    //因為習慣是用陣列集合所有需要被送到localStorage的資料
    localStorage.setItem('BMI',JSON.stringify(data));
    renderList();
    addDemoText();
}