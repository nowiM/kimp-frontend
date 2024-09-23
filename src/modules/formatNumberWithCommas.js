const formatNumberWithCommas = (number, digits) => {
    const factor = Math.pow(10, digits);
    const realNumber = Math.floor(number * factor) / factor; // 반올림 없이 자르기
    const parts = realNumber.toString().split('.'); // 정수 부분과 소수 부분을 나눔

    // 정수 부분에 쉼표 추가
    parts[0] = Number(parts[0]).toLocaleString();

    // 소수 부분의 자릿수를 맞추기
    if (parts[1]) {
        while (parts[1].length < digits) {
            parts[1] += '0'; // 부족한 자리수를 0으로 채움
        }
    } else {
        parts[1] = '0'.repeat(digits); // 소수점 이하가 없으면 0으로 채움
    }

    return parts.join('.');
}

export default formatNumberWithCommas;