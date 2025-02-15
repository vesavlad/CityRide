import { Model, Modifiers } from 'objection'
import Trip from './Trip'
import Feed from './Feed'
import Stop from './Stop'

export default class StopTime extends Model {
    tripId!:string
    feedId!:string
    arrivalTime:Date|null
    departureTime:Date|null
    stopId!:string
    stopSequence!:number
    stopHeadsign:string|null
    pickupType:number|null
    dropoffType:number|null
    timepoint:number|null
    shapeDistTraveled:string|null

    trip?:Trip
    feed?:Feed
    stop?:Stop

    static tablename='stopTimes'

    static modifiers:Modifiers = {
        idPrimaryKey(){
            return ['trip_id', 'feed_id', 'stop_id']
        },
        tripForeignKey() {
            return ['tripId', 'feedId']
        },
        stopForeignKey() {
            return ['stopId', 'feedId']
        }
    }

    // https://gtfs.org/reference/static/#stop_timestxt
    static jsonSchema = {
        type: 'object',
        required: ['trip_id', 'feed_id', 'stop_id'],

        properties: {
            tripId: {type: 'string' },
            feedId: {type: 'string' },
            arrivalTime: {type: 'date' },
            departureTime: {type: 'date' },
            stopId: {type: 'string'},
            stopSequence: {type: 'number'},
            stopHeadsign: {type: 'string'},
            pickupType: {
                type: 'number', 
                enum: [0, 1, 2, 3]
            },
            dropoffType: {
                type: 'number',
                enum: [0, 1, 2, 3]
            },
            timepoint: {
                type: 'number',
                enum: [0, 1]
            },
            shapeDistTraveled: {type: 'string'},
        },
    }

    static relationMappings = () => ({
        trip: {
            relation: Model.BelongsToOneRelation,
            modelClass: Trip,
            join: {
                from: ['stopTimes.tripId', 'stopTimes.feedId'],
                to: ['trips.id', 'trips.feedId']
            }
        },
        feed: {
            relation: Model.BelongsToOneRelation,
            modelClass: Feed,
            join: 
                {
                    from: 'stopTimes.feedId',
                    to: 'feeds.id'
                },
        },
        stop: {
            relation: Model.BelongsToOneRelation,
            modelClass: Stop,
            join: 
                {
                    from: ['stopTimes.stopId', 'stopTimes.feedId'],
                    to: ['stops.id', 'stops.feedId']
                },
        }
    })
}