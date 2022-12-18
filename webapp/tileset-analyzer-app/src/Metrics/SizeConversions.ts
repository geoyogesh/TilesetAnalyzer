const Units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const Units1 = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];


export const bytesToString = (bytes: number, si = false, dp = 1): string => {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si ? Units : Units1;
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}


export const bytesUnit = (bytes: number, si = false, dp = 1): string => {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return 'B';
    }

    const units = si ? Units : Units1;
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return units[u];
}


export const bytesConverted = (input_bytes: number, targetUnit : string, si = false, dp = 1): number => {
    let bytes = input_bytes;
    const thresh = si ? 1000 : 1024;

    let targetUnitIndex = -1;
    if (Units.indexOf(targetUnit) !== -1) {
        targetUnitIndex = Units.indexOf(targetUnit);
    }
    if (Units1.indexOf(targetUnit) !== -1) {
        targetUnitIndex = Units1.indexOf(targetUnit);
    }
    const units = si ? Units : Units1;
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (u < units.length - 1 && u + 1 === targetUnitIndex);

    return Number(bytes.toFixed(dp));
}