import {SensorPower} from '../../enums/SensorPower';

/**
 * Sensor is able to report temperature measurements
 * to the application
 */
export type Sensor = {
    /**
     * Unique id of the sensor (like a serial number)
     */
    id: string,
    /**
     * Type of the power supply the sensor is running on
     */
    power: SensorPower
}

