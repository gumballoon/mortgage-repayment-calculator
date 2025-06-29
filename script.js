const numberInputs = document.querySelectorAll('.number');

// to style the background of INPUT-TAG when in focus
for (let input of numberInputs){
    let tag = ''; // to hold the INPUT-TAG of each input
    for (i of input.children){
        if (i.classList.contains('input-tag')){
            tag = i;
        }
    }

    input.addEventListener('focusin', function(){
        tag.style.backgroundColor = 'hsl(61, 70%, 52%)';
    });

    input.addEventListener('focusout', function(){
        tag.style.backgroundColor = '';
    });
}

// to focus on the input when its container is clicked-on
const allInputBorders = document.querySelectorAll('.input-border');
for (let inputBorder of allInputBorders) {
    const input = inputBorder.querySelector('input');
    inputBorder.addEventListener('click', function(){
        input.focus();
    })
}

const radioInputs = document.querySelectorAll('input[type="radio"]');
const repaymentLabel = document.querySelector('label[for="repayment"]');
const interestLabel = document.querySelector('label[for="interest-only"]');
const radioError = document.querySelector('#radio-error');

// to style the background of RADIO-LABEL when checked
for (radio of radioInputs){
    radio.addEventListener('change', function(){
        if(this.id === 'repayment'){
            repaymentLabel.classList.add('radio-label-checked');
            interestLabel.classList.remove('radio-label-checked');
        } else {
            interestLabel.classList.add('radio-label-checked');
            repaymentLabel.classList.remove('radio-label-checked');
        }

        // hides the error messages if it's being showned
        if (!radioError.classList.contains('d-none')) radioError.classList.add('d-none')
    })
}

// Form Validation //

const form = document.querySelector('form');
const allInputs = form.elements;
const emptyResults = document.querySelector('#empty-results');
const completedResults = document.querySelector('#completed-results');

// to verify all constraints & apply the error styling
function isFormValid() {
    let result = true; // to hold the final result (return true would break the code & not cover all inputs)

    for (let number of numberInputs){

        let input = ''; // to hold the INPUT
        let tag = ''; // to hold the INPUT-TAG of each input
        
        for (let i of number.children){
            if (i.localName === 'input') input = i;
            else if (i.classList.contains('input-tag')){
                tag = i;
            }
        }

        const error = number.nextElementSibling;

        // if there is a value missing, style the input & show the error message
        if(input.validity.valueMissing){
            number.classList.add('input-border-error')
            tag.classList.add('input-tag-error')
            error.classList.remove('d-none');
            result = false;
        }

        // to reset the display if the user starts typing
        input.addEventListener('input', function(){
            this.parentElement.classList.remove('input-border-error');
            tag.classList.remove('input-tag-error')
            error.classList.add('d-none');
        })
    }
    // show the error message if one of the radio inputs isn't selected
    if (!radioInputs[0].checked && !radioInputs[1].checked){
        radioError.classList.remove('d-none');
        result = false;
    }

    return result;
}

form.addEventListener('submit', function(e){
    e.preventDefault();

    if (isFormValid()){
        emptyResults.classList.add('d-none');
        completedResults.classList.remove('d-none');

        const amount = parseFloat(allInputs["amount"].value);
        // to get the total number of months (payments)
        const term = parseInt(allInputs["term"].value) * 12;
        // to get the monthly rate
        const rate = parseFloat(allInputs["rate"].value) / (100 * 12);

        // results
        const monthlyRepay = document.querySelector('#monthly-repay');
        const totalRepay = document.querySelector('#total-repay');

        if (allInputs["repayment"].checked){
            const calc = (1 + rate) ** term;
            let result = amount * ((rate * calc) / (calc - 1));
            // to round to 2 decimal places
            result = Math.round(result * 100) / 100

            monthlyRepay.textContent = '£' + result.toLocaleString('en-GB');
            totalRepay.textContent = '£' + (result * term).toLocaleString('en-GB');
        } else { 
            const monthlyResult = Math.round(amount * rate * 100) / 100;
            const totalResult = Math.round(monthlyResult * term + amount);

            monthlyRepay.textContent = '£' + monthlyResult.toLocaleString('en-GB');
            totalRepay.textContent = '£' + totalResult.toLocaleString('en-GB');
        }
    }
})

const clear = document.querySelector('#clear');

// to clear the form
clear.addEventListener('click', function(e){
    e.preventDefault();
    for (input of allInputs){
        input.value = '';
        if (input.checked) input.checked = false;


        // to hide all errors
        const allErrors = document.querySelectorAll('.error');
        for (let error of allErrors) {
            error.classList.add('d-none');
        }
        const allBorderErrors = document.querySelectorAll('.input-border-error');
        for (let borderError of allBorderErrors) {
            borderError.classList.remove('input-border-error');
        }
        const allTagErrors = document.querySelectorAll('.input-tag-error');
        for (let tagError of allTagErrors) {
            tagError.classList.remove('input-tag-error');
        }

        repaymentLabel.classList.remove('radio-label-checked');
        interestLabel.classList.remove('radio-label-checked');
        if (!radioError.classList.contains('d-none')) radioError.classList.add('d-none');
        if (emptyResults.classList.contains('d-none')) emptyResults.classList.remove('d-none');
        if (!completedResults.classList.contains('d-none')) completedResults.classList.add('d-none');
    }
})


