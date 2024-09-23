import formatNumberWithCommas from './formatNumberWithCommas.js';

const formatUpbitPrice = (price) => {
    if(price >= 1000 || price <= -1000) {
        return Math.floor(price).toLocaleString(); // 천 단위 이상의 정수 부분에 쉼표 추가
    } else if(price >= 100 || price <= -100) {
        return formatNumberWithCommas(price, 1); // 소수점 이하 1자리까지 표현
    } else if(price >= 10 || price <= -10) {
        return formatNumberWithCommas(price, 2); // 소수점 이하 2자리까지 표현
    } else if(price >= 1 || price <= -1) {
        return formatNumberWithCommas(price, 3); // 소수점 이하 3자리까지 표현
    } else {
        return formatNumberWithCommas(price, 4); // 소수점 이하 4자리까지 표현
    }
}

export default formatUpbitPrice;
