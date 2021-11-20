import BigNumber from "bignumber.js";

export type Numberish = BigNumber | string | number;

/**
 * Convert a token unit amount to weis. E.g., 10.1 ETH -> 10100000000000000000.
 */
export function fromTokenUnitAmount(units: Numberish, decimals: number = 18): BigNumber {
    return new BigNumber(units).times(new BigNumber(10).pow(decimals)).integerValue();
}

/**
 * Convert a wei amount to token units. E.g., 10100000000000000000 -> 10.1 ETH.
 */
export function toTokenUnitAmount(weis: Numberish, decimals: number = 18): BigNumber {
    return new BigNumber(weis).div(new BigNumber(10).pow(decimals));
}

export const isNotZeroAddr = (addr: string): boolean => addr !== "0x0000000000000000000000000000000000000000";

export function httpGet(theUrl) {
    return new Promise(resolve => {
        let xmlhttp;

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                resolve(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", theUrl, false);
        xmlhttp.send();
    })
}

export function getJSON(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            const status = xhr.status;
            if (status === 200) {
                resolve(xhr.response);
            } else {
                resolve(xhr.response);
            }
        };
        xhr.send();
    })
};
