// Inicialización de variables
const monthsYear = 12;
let balance;
let termYears;
let interestRate;
let termMonths = 0;
let monthlyFee = 0;
let interestPayment = 0;
let capitalPayment = 0;

//Inicialización del array que va a contener el plan de pagos en función del plazo definido
let paymentPlans = [];
(balance);

// !Función para capturar el valor del evento del ingreso de la cantidad a prestar y el plazo para pagar
const onChange = (e) => {
    if (e.target.id === 'balance') {
        balance = Number(e.target.value);
    };
    if (e.target.id === 'termYears') {
        termYears = Number(e.target.value);
        onGetYears(termYears)
    };
};

// Función asíncrona que va a consutar por medio de feth el equivalente en meses del plazo el año elegido
const onGetYears = async (year) => {
    await fetch("../apiData.json")
        .then(response => response.text())
        .then(data => {
            const json = JSON.parse(data);
            termMonths = json.find((element) => element.year === year).months;
        });
}

// Función para calcular la cantidad de cuotas mensuales según los años de plazo indicados por el usuario
// function calculateTermMonths(termYears) {
//     return termMonths = termYears * monthsYear;
// }

// Función para calcular el valor de la cuota mensual de acuerdo a los datos del monto solicitado a prestar, la tasa de interes y el plazo en meses
function calculateInstallment(balance, interestRate, termMonths) {
    return monthlyFee = ((balance * interestRate) / (1 - (1 + interestRate) ** (-termMonths))).toFixed(1);
}

// Función para calcular el valor abonado a intereses
function calculateInterestPayment(bal, intRate) {
    interestPayment = (bal * intRate).toFixed(1);
}

// Función para calcular el valor abonado a capital
function calculatePaymentCapital(mFee, intPay) {
    capitalPayment = (mFee - intPay).toFixed(1);
}

// Función para calcular el saldo después de cada pago
function calculateBalance(bal, capPay) {
    if ((bal - capPay).toFixed(1) <= 0) {
        balance = 0;
    } else {
        balance = (bal - capPay).toFixed(1);
    }
}

// !Función para crear la sección del plan de pagos manipulando el DOM
const onCreateSectionToPaymentPlans = () => {
    let paymentsContainer = document.createElement('section');
    paymentsContainer.id = 'paymentsContainer';
    paymentsContainer.className = 'paymentsContainer';

    document.body.appendChild(paymentsContainer)

    let paymentsTitle = document.createElement('h2');
    paymentsTitle.innerHTML = 'Plan de pagos detallado'

    let paymentsHeader = document.createElement('div');
    paymentsHeader.id = 'paymentsHeader'
    paymentsHeader.innerHTML = `
        <span>N° de cuota</span>
        <span>Abono a capital (USD)</span>
        <span>Abono a intereses (USD)</span>
        <span>Saldo después del pago (USD)</span>
    `;

    document.getElementById('paymentsContainer').appendChild(paymentsTitle);
    document.getElementById('paymentsContainer').appendChild(paymentsHeader);

    // For of para ejecutar para cada elemento del objeto del plan de pagos en función de la cantidad de cuotas del préstamo simulado
    for (const payment of paymentPlans) {
        let paymentContainer = document.createElement('div');
        paymentContainer.id = 'paymentContainer'
        paymentContainer.innerHTML = `
            <span>${payment.quotaNumber}</span>
            <span>${payment.capitalPayment}</span>
            <span>${payment.interestPayment}</span>
            <span>${payment.balance}</span>
        `;
        document.getElementById('paymentsContainer').appendChild(paymentContainer);
    }
}

// !Función para validar que los valores de cantidad a prestar y plazo en años estén dentro de los rangos definidos. Aquí voy a implementar sweet alert
const onValidateForm = (event) => {
    event.preventDefault();

    if (balance < 1000 || balance > 100000 || balance === undefined) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La cantidad que estás solicitando no es válida, prestamos desde 1000USD y hasta 100000USD.'
        })
        //document.getElementById('errorBalance').innerHTML = "La cantidad que estás solicitando no es válida, prestamos desde 1000USD y hasta 100000USD.";
        return;
    };
    if (termYears === undefined) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debes seleccionar un plazo'
        })
        //document.getElementById('errorTermYears').innerHTML = "Debes seleccionar un plazo";
        return;
    };

    paymentPlans = [];
    localStorage.removeItem('lastPaymentPlan')

    const element = document.getElementById("paymentsContainer");
    if (element) {
        element.remove();
    }

    const x = {
        '1': 0.03,
        '2': 0.025,
        '3': 0.025,
        '4': 0.02,
        '5': 0.02
    }
    interestRate = x[termYears];

    if (termYears == 1) {
        document.getElementById('interestRate').innerHTML = `La tasa de interés para el plazo de ${termYears} años es 3% mes vencido.`;
    } else if (termYears == 2 || termYears == 3) {
        document.getElementById('interestRate').innerHTML = `La tasa de interés para el plazo de ${termYears} años es 2.5% mes vencido.`;
    } else {
        document.getElementById('interestRate').innerHTML = `La tasa de interés para el plazo de ${termYears} años es 2% mes vencido.`;
    };

    // Manipulación del DOM para agregar elementos que den detalles del crédito simulado
    //calculateTermMonths(termYears);
    document.getElementById('termMonths').innerHTML = `Según el plazo que requieres, las cuotas mensuales serían: ${termMonths}.`;
    calculateInstallment(balance, interestRate, termMonths);
    document.getElementById('installment').innerHTML = `El valor de tu cuota fija mensual sería: ${monthlyFee} USD.`;
    document.getElementById('installment').innerHTML = `El plan detallado de pagos lo encuentras al final de la página.`;

    // Ciclo para calcular el abono a intereses, el abono a capital y el saldo para cada una de las cuotas mensuales
    for (let i = 1; i <= termMonths; i++) {
        ("Cuota No", i);
        calculateInterestPayment(balance, interestRate);
        calculatePaymentCapital(monthlyFee, interestPayment);
        calculateBalance(balance, capitalPayment);
        paymentPlans.push({
            quotaNumber: i,
            interestPayment,
            capitalPayment,
            balance,
        })
    }

    // Implementación del uso del local storage para guardar el último plan de pagos producto de la última simulación de crédito realizada
    onCreateSectionToPaymentPlans();
    localStorage.setItem('lastPaymentPlan', JSON.stringify(paymentPlans))
};

const onGetLocalStorage = () => {
    paymentPlans = JSON.parse(localStorage.getItem('lastPaymentPlan'))
}

const onGetLastPaymentPlan = () => {
    if (paymentPlans.length > 1) {
        return;
    };
    onGetLocalStorage();
    onCreateSectionToPaymentPlans()
};

// Crear el botón de consulta del último plan de pagos si existe localstorage
if (localStorage.getItem('lastPaymentPlan')) {
    let button = document.createElement('button');
    button.innerHTML = 'Consultar último plan de pagos simulado'
    button.id = 'consultPayment'
    document.getElementById('lastPaymentPlanContainer').appendChild(button);
}

document.getElementById('balance').addEventListener('change', onChange);
document.getElementById('termYears').addEventListener('change', onChange);

document.getElementById('botonGenerar').addEventListener('click', (e) => onValidateForm(e))

document.getElementById('consultPayment').addEventListener('click', onGetLastPaymentPlan);