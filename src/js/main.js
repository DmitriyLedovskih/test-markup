import "../scss/style.scss";

import { headerFixed, showModal, showModalMenu } from "./script.js";

showModal(".burger", "#burger-modal", "click");
showModal("#events", "#events-modal", "hover");
showModal("#gift-sets", "#gift-sets-modal", "hover");
showModalMenu();
headerFixed();
