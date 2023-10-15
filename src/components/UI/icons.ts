import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faCloudArrowUp,
    faMoon,
    faSun,
    faSquarePlus,
    faHome,
    faRightFromBracket,
    faFolder,
    faFile,
    faPlus,
    faMinus,
    faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";

export const setupIcons = () => {
    library.add(faCloudArrowUp,faMoon, faSun, faSquarePlus, faHome, faRightFromBracket, faFolder, faFile, faPlus, faMinus, faArrowRotateRight);
}