let data = '';

let gdlSelect = document.getElementById('g-position');
gdlSelect.onclick = function () {
    let gdlIndex = gdlSelect.selectedIndex,
        gValue = gdlSelect.options[gdlIndex].value;
    if (gValue == 3) {
        $('#g-setting').removeAttr("disabled");
        $('#col-r').removeAttr("disabled");
    } else {
        $('#g-setting').attr('disabled', true);
        $('#col-r').attr('disabled', true);
    }
};
let getValue = function () {
    let qName = document.getElementById('q-name').value;

    let gdlSelect = document.getElementById('g-position'),
        gdlIndex = gdlSelect.selectedIndex,
        gValue = gdlSelect.options[gdlIndex].value;

    let cols = document.getElementById('cols'),
        colsIndex = cols.selectedIndex,
        colsValue = cols.options[colsIndex].text;

    let gSetting = document.getElementById('g-setting'),
        gSettingIndex = gSetting.selectedIndex,
        gSettingValue = gSetting.options[gSettingIndex].text;

    let rCol = document.getElementById('col-r'),
        rColIndex = rCol.selectedIndex,
        rColValue = rCol.options[rColIndex].text;


    let col = document.getElementById('col'),
        colIndex = col.selectedIndex,
        colValue = col.options[colIndex].text;

    let divs = document.getElementById('divs'),
        divsIndex = divs.selectedIndex,
        divsValue = divs.options[divsIndex].text;

    let lays = document.getElementById('lays'),
        laysIndex = lays.selectedIndex,
        laysValue = lays.options[laysIndex].text;

    let capacity = document.getElementById('capacity'),
        capIndex = capacity.selectedIndex,
        capValue = capacity.options[capIndex].text;

    let ventgaps = document.getElementById('ventgaps'),
        vgIndex = ventgaps.selectedIndex,
        vgValue = ventgaps.options[vgIndex].text;

    let width = document.getElementById('width'),
        wIndex = width.selectedIndex,
        wValue = width.options[wIndex].text;

    let speed = document.getElementById('speed'),
        sIndex = speed.selectedIndex,
        sValue = speed.options[sIndex].text;

    let videoIp = document.getElementById('videoIp'),
        vIpIndex = videoIp.selectedIndex,
        vIpValue = videoIp.options[vIpIndex].text;

    let IP = document.getElementById('IP').value;

    let port2 = document.getElementById('port2').value;

    let port1 = document.getElementById('port1').value;

    data = {
        quNumLeft: colValue,
        name: qName,
        capacity: capValue,
        speed: sValue,
        width: wValue,
        ip: IP,
        httpPort: port1,
        tcpPort: port2,
        videoIps: vIpValue,
        tempture: 1,
        humi: 1,
        fkStoreId: store_id,
        rdStoreName: store_name,
        quNumRigth: rColValue,
        gdlType: gValue,
        cols: colsValue,
        divs: divsValue,
        lays: laysValue,
        staticCol: gSettingValue,
        ventgaps: vgValue
    };
};

