const fadeWindowOut =  (_window, step = 0.1, fadeEveryXSeconds = 10, hideWindow = false) =>  {
    let opacity = _window.getOpacity()
    const interval = setInterval(() => {
        if (opacity <= 0) {
            clearInterval(interval)
            if (hideWindow)
                _window.hide()
            else
                _window.minimize()
        }
        _window.setOpacity(opacity)
        opacity -= step
    }, fadeEveryXSeconds)
    return interval
}

const fadeWindowIn = (_window, step = 0.1, fadeEveryXSeconds = 10)  => {
    let opacity = _window.getOpacity()
    const interval = setInterval(() => {
        if (opacity >= 1) clearInterval(interval)
        _window.setOpacity(opacity)
        opacity += step
    }, fadeEveryXSeconds)
    return interval
}

module.exports = {
    fadeWindowOut, fadeWindowIn
}