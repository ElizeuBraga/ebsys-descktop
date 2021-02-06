import Swal from 'sweetalert2';

const util = require('util');
export class Helper {
    async max(table) {
        let sql = 'select case when max(id) is null then 0 else max(id) end as "max" from ' + table;

        let result = await db.get(sql);
        return result.max
    }

    formatMoney(value){
        return parseFloat(value).toFixed(2).replace('.', ',')
    }

    formatMonetaryForDB(value) {
        let result = null;
        if (this.isString(value)) {
            result = value.replace('.', '').replace(',', '.')
        } else if (this.isFloat(value)) {
            result = value.toFixed(2)
        } else {
            result = parseFloat(value).toFixed(2)
        }
        return result
    }

    isString(value) {
        return typeof value === 'string' || value instanceof String;
    }

    isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
    }

    inputMask(value) {
        let withoutDot = value.replace(".", "");
        let firstPart = withoutDot.slice(0, withoutDot.length - 2);
        let endPart = withoutDot.slice(withoutDot.length - 2);
        var output = [firstPart, ".", endPart].join("");

        // if (withoutDot.length > 0) {
        //     input.value = output;
        // }

        return output;
    }

    initLoginProccess(){
        Swal.fire({
            title:"Text",
            html:"",
        })
    }

    getHtmlResumeCashier(amounts){
        let total = 0;
        let html = `<table style="width:100%" class="table table-striped" id="table_resume_close">
                <tr>
                    <th class="text-left">Tipo</th>
                    <th class="text-right">Valor</th>
                    <th class="text-right">Opções</th>
                    </tr>`;
            html += '';
            amounts.forEach(element => {
                total += parseFloat(element.value);
                html +=`
                <tr class="${element.name}">
                <td class="text-left">${element.name}</td>
                <td class="text-right">${parseFloat(element.value).toFixed(2).replace('.', ',')}</td>
                <td class="text-right"><button class="btn btn-sm btn-danger" id="${element.name}">Remover</button></td>
                </tr>
                `
            });
            html +=`
            <tr class="text-left" >
            <td><b>Total</b></td>
                <td class="text-right"><b>${parseFloat(total).toFixed(2).replace('.', ',')}</b></td>
                <td class="text-centers"></td>
            </tr>
            `
            html += `</table>`;

        return html;
    }

    removeValidationMessage(timer = 2000){
        setTimeout(()=>{
            Swal.resetValidationMessage()
        }, timer)
    }
}
