import EventBus from '../EventBus';
import {Payment} from '../models/Payment';
export default {
    data() {
        return {
            tabIndex:0,
            paymentsFormats: [],
            cashierIsOpen: false,
            bluePrimary: "#2778c4",
        }
    },

    async created() {
        EventBus.$on("change-tab", (e) => {
            this.tabIndex = e;
        });
        this.paymentsFormats = await new Payment().all();
    },

    computed: {
        
    },

    methods: {
        formatMoney(value){
            return parseFloat(value).toFixed(2).replace('.', ',')
        }
    },
}