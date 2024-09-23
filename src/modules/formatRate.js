const formatRate = (rate) => {
    const rateStr = (Math.floor(rate * 100) / 100).toString();
    const parts = rateStr.split('.');

    // 소수점 아래 자릿수를 2자리로 맞추기
    if (parts.length === 1) {
        return parts[0] + '.00';  // 소수점 이하가 없으면 .00 추가
    } else if (parts[1].length === 1) {
        return parts[0] + '.' + parts[1] + '0';  // 소수점 이하가 1자리이면 0 추가
    } else {
        return rateStr;  // 이미 2자리이면 그대로 반환
    }
};

export default formatRate;