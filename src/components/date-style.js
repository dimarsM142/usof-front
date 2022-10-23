function checkMonth(month){
    switch (month) {
        case 0:
          return 'Січня';
        case 1:
            return 'Лютого';
        case 2:
            return 'Березня';
        case 3:
            return 'Квітня';
        case 4:
            return 'Травня';
        case 5:
            return 'Червня';
        case 6:
            return 'Липня';
        case 7:
            return 'Серпня';
        case 8:
            return 'Вересня';
        case 9:
            return 'Жовтня';
        case 10:
            return 'Листопада';
        case 11:
            return 'Грудня';
        default:
            return 'Найкращий';
      }
}
export function parseDate(date){
    const parsedDate = new Date(date);
    const curDate = Date.now();
    const diff = curDate - parsedDate.getTime();
    if(diff < 1000 * 60){
        return `${Math.floor(diff / 1000)}с тому`
    }
    else if(diff < 1000 * 60 * 60){
        return `${Math.floor(diff / 60000)}хв тому`
    }
    else if(diff < 1000 * 60 * 60 * 24){
        const res = Math.floor(diff / 3600000);
        if(res === 1 || res === 21){
            return `${res} годину тому`
        }
        else if(res === 2 || res === 3 || res === 4 || res === 22 || res === 23 || res === 24) {
            return `${res} години тому`
        }
        else {
            return `${res} годин тому`;
        }
        
    }
    else if(diff < 1000 * 60 * 60 * 24 * 365){
        return `${parsedDate.getHours()}:${(parsedDate.getMinutes() < 10 ? '0' : '') + parsedDate.getMinutes()} ${parsedDate.getDate()} ${checkMonth(parsedDate.getMonth())}`;
    }
    else {
        return `${parsedDate.getHours()}:${(parsedDate.getMinutes() < 10 ? '0' : '') + parsedDate.getMinutes()} ${parsedDate.getDate()} ${checkMonth(parsedDate.getMonth())} ${parsedDate.getFullYear()} року`;
    }
}
