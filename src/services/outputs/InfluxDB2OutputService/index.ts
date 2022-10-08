import {InfluxDB, Point} from '@influxdata/influxdb-client'
import {MeasuredTemperature} from '../../../types/MeasuredTemperature';
import ConfigurationManager from '../../../helper/ConfigurationManager';
import Log from '../../../helper/Log';

export default class InfluxDB2OutputService {

    public static async saveMeasuredTemperatureAsync(measuredTemperature: MeasuredTemperature) {

        const outputInfluxdb2Enabled: boolean = Boolean(ConfigurationManager.get('output:influxdb2:enabled'));
        const outputInfluxdb2Url = ConfigurationManager.get('output:influxdb2:url');
        const outputInfluxdb2Token = ConfigurationManager.get('output:influxdb2:token');
        const outputInfluxdb2Organisation = ConfigurationManager.get('output:influxdb2:organisation');
        const outputInfluxdb2Bucket = ConfigurationManager.get('output:influxdb2:bucket');

        if (outputInfluxdb2Enabled) {

            try {
                const influxDB = new InfluxDB({url: outputInfluxdb2Url, token: outputInfluxdb2Token})
                const influxDBWriteApi = influxDB.getWriteApi(outputInfluxdb2Organisation, outputInfluxdb2Bucket)

                const influxTemperaturePoint = new Point('temperature')
                    .tag('sensor_id', measuredTemperature.sensor.id)
                    .tag('sensor_name', '')
                    .floatField('degrees', measuredTemperature.temperature)

                influxDBWriteApi.writePoint(influxTemperaturePoint)

                // WriteApi always buffer data into batches to optimize data transfer to InfluxDB server and retries
                // writing upon server/network failure. writeApi.flush() can be called to flush the buffered data,
                // close() also flushes the remaining buffered data and then cancels pending retries.
                influxDBWriteApi
                    .close()
                    .then(() => {
                        Log.verbose('InfluxDB2', 'Measure successfully transmitted to host');
                    })
                    .catch(e => {
                        Log.warn('InfluxDB2', e.toString())
                    })

            } catch (e: any) {
                Log.warn('InfluxDB2', e.toString())
            }
        }
    }
}
