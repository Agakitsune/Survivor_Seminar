
const { default: Widget } = require("./Widget");

export default class Time extends Widget {

    constructor(props) {
        super(props);
        console.log(this.state.width);
    }

    static getDefaultSize() {
        return this.getMinimalSize();
    }

    static getMinimalSize() {
        return {
            width: 2,
            height: 2
        }
    }
}
