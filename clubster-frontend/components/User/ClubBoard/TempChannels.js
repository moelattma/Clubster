// Temporary? 
// page shows all channels in club

export default class TempChannels extends Compenent {
    render() {
        const { _id, clubsterNaviigation, clubBoardNav, isAdmin } = this.props.screenProps;
        return (
            <ClubEventNavigator screenProps={{ _id, ClubEventNavigator, clubBoardNav, isAdmin }}/>
        );
    };
}

class ShowChannels extends Component {
    constructor(props) {
        
        super(props);

        this.state = {
            channels: [],
            loading: false,
            idOfUser: '',
            name: ''
        }
    }

    _createEvent = () => {

    }

    _renderItem = ({ item }) => {
        const { name } = this.state;

        return (
            <TouchableWithoutFeedback onPress={() => this.navigateUser(item)} style={}>
                <Text>{item.name}</Text>
            </TouchableWithoutFeedback>
        )
    }
}