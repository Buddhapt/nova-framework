--[[
    NOVA Framework - Weather Sync (Client)
    Recebe o estado de tempo/clima do servidor e aplica localmente.
    Desativa o weather nativo do GTA para evitar conflitos.
]]

if not NovaConfig.Weather or not NovaConfig.Weather.enabled then return end

-- ============================================================
-- ESTADO LOCAL
-- ============================================================

local currentWeather  = 'CLEAR'
local currentHour     = 8
local currentMinute   = 0
local weatherReady    = false
local lastWindWeather = ''

-- ============================================================
-- EVENTO: Receber sync do servidor
-- ============================================================

RegisterNetEvent('nova:client:syncWeather', function(data)
    if not data then return end

    currentHour   = data.hour or currentHour
    currentMinute = data.minute or currentMinute

    if data.weather and data.weather ~= currentWeather then
        currentWeather = data.weather
        ClearWeatherTypePersist()
        ClearOverrideWeather()
        SetWeatherTypeNowPersist(currentWeather)
        SetWeatherTypeNow(currentWeather)
        SetOverrideWeather(currentWeather)
    end

    weatherReady = true
end)

-- ============================================================
-- PEDIR ESTADO AO ENTRAR
-- ============================================================

AddEventHandler('playerSpawned', function()
    TriggerServerEvent('nova:server:requestWeather')
end)

-- ============================================================
-- THREAD: Aplicar hora e manter weather
-- ============================================================

CreateThread(function()
    Wait(2000)
    TriggerServerEvent('nova:server:requestWeather')

    while true do
        if weatherReady then
            NetworkOverrideClockTime(currentHour, currentMinute, 0)

            -- Forçar o weather a cada tick para impedir o GTA de mudar sozinho
            SetOverrideWeather(currentWeather)
        end
        Wait(250)
    end
end)

-- ============================================================
-- WIND (efeitos visuais para chuva/trovoada)
-- ============================================================

CreateThread(function()
    while true do
        Wait(2000)

        if weatherReady and currentWeather ~= lastWindWeather then
            lastWindWeather = currentWeather
            if currentWeather == 'RAIN' or currentWeather == 'THUNDER' then
                SetWind(0.5)
                SetWindSpeed(8.0)
                SetWindDirection(math.random() * 360.0)
            elseif currentWeather == 'FOGGY' then
                SetWind(0.1)
                SetWindSpeed(2.0)
            else
                SetWind(0.0)
                SetWindSpeed(0.0)
            end
        end
    end
end)
