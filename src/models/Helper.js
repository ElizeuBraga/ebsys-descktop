import Swal from 'sweetalert2';

const util = require('util');
export class Helper {
    async max(table) {
        let sql = 'select case when max(id) is null then 0 else max(id) end as "max" from ' + table;

        let result = await db.get(sql);
        return result.max
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
}
