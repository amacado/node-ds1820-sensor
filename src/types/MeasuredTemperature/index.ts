import {Sensor} from '../Sensor';

export type MeasuredTemperature = {
    /**
     * Sensor which has reported the temperature
     */
    sensor: Sensor,
    /**
     * Measured temperature in °C
     */
    temperature: number
}

