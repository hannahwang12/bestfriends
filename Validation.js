import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import ValidationPhoto from './ValidationPhoto';
import ValidationScreen from './ValidationScreen';
import Confirm from './ConfirmPhotosModal'
import { MediaLibrary } from 'expo';

export default class Validation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      expand: null,
      confirm: false,
    };
    const isRecommended = photo => photo.isCentered && photo.isClear &&
                                   photo.isBright   && photo.hasDog;
    this.state.recommendedPhotos = props.photos.filter(isRecommended);
    this.state.otherPhotos = props.photos.filter(photo => !isRecommended(photo));
    console.log(this.state);
  }

  addPhoto = (photo) => {
    if (this.state.photos.includes(photo)) {
      this.setState({photos: this.state.photos.filter((elem) => elem != photo)});
    } else {
      this.setState({photos: [...this.state.photos, photo]});
    }
  }

  confirm = () => {
    this.setState({ confirm: !this.state.confirm })
  }

  finish = () => {
    let saveablePhotos = [];
    console.log(this.state.photos)
    this.state.photos.map((elem) => {
      console.log(elem.substring(0,7))
      if (elem.substring(0, 7) !== 'content') saveablePhotos.push(elem)
    })
    console.log(saveablePhotos)
    let unsaveablePhotos = this.state.photos.length - saveablePhotos.length;
    const message = unsaveablePhotos ? unsaveablePhotos + " photos are already in your camera roll." : "";
    Alert.alert(
      "You've selected " + this.state.photos.length + " photos to save",
      message + "The photos you didn't select will be discarded.",
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: async () => await this.savePhotos(saveablePhotos)},
      ],
      { cancelable: false }
    )
  }

  savePhotos = async (saveablePhotos) => {
    console.log('savephoto')
    let promises = saveablePhotos.map((elem => {
      return MediaLibrary.createAssetAsync(elem).then((asset) => {
        MediaLibrary.createAlbumAsync('Best Friends', asset)
        .then(() => {
          console.log('Album created!');
        })
        .catch(error => {
          console.log(  'err', error);
        });
      })
      }))
    Promise.all(promises)
    // const asset = await MediaLibrary.createAssetAsync(this.photos[0]);
    // MediaLibrary.createAlbumAsync('Expo', asset)
    // MediaLibrary.addAssetsToAlbumAsync(this.photos, 'Expo').then(() => console.log("saved"))
  }

  expand = (photo) => {
    this.setState({expand: photo})
  }

  navigateBack = () => {
    this.setState({expand: null})
  }

  render() {
    return (
      this.state.expand ? <ValidationScreen expand={this.expand} img={this.state.expand.uri} valRes={this.state.expand} navigateBack={this.navigateBack} navigateFinish={this.finish} numPhotos={this.state.photos.length} addPhoto={this.addPhoto} selected={this.state.photos.includes(this.state.expand.uri)}></ValidationScreen> :
      <View style = {{flex: 1}}>
        {console.log(this.props.photos)}
        <View style={{ flexDirection: "row", justifyContent: 'space-between', alignContent: 'center', height: 50, marginLeft: 5, marginRight: 5 }}>
          <TouchableOpacity style={styles.backButton} onPress={this.props.back}>
            <Image style={styles.backIcon} source = {require('./assets/back.png')}></Image>
          </TouchableOpacity>
          <Text style = {{alignSelf: 'center', fontWeight: 'bold', justifyContent: 'center' }}> Save Your Photos</Text>
          {/* <View style = {{flex: 1, flexDirection: 'row', alignSelf: 'center', backgroundColor: 'red'}}>
            
          </View> */}
          <View style={{ flexDirection: "row" }}>
            <View style={styles.circle}>
              <Text style={{ color: "white" }}>{this.state.photos.length}</Text>
            </View>
            <TouchableOpacity style={styles.navbarButton} onPress={this.finish}>
              <Text style={{ color: "#FA770B", fontWeight: "bold" }}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={{padding: 5}}>
          <Text style={styles.header}>The ones we like</Text>
          <View style={styles.gallery}>
            {this.state.recommendedPhotos.map((elem, key) => 
              <ValidationPhoto key={key} photo={elem} addPhoto={this.addPhoto} expand={this.expand} selected={this.state.photos.includes(elem.uri)}></ValidationPhoto>)}
          </View>
          <Text style={styles.header}>Other photos you took</Text>
          <View style={styles.gallery}>
            {this.state.otherPhotos.map((elem, key) => 
              <ValidationPhoto key={key} photo={elem} addPhoto={this.addPhoto} expand={this.expand} selected={this.state.photos.includes(elem.uri)}></ValidationPhoto>)}
          </View>
          {/* <Confirm></Confirm> */}
        </ScrollView>

      </View>
    );
  }
}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  navbarButton: {
    margin: 15
  },
  header: {
    fontSize: 18,
  },
  gallery: {
    flex: 1,
    flexDirection: "row",
    flexWrap: 'wrap',
    paddingBottom: 10,
  },
  image: {
    width: (width - 25) / 3,
    height: (width - 25) / 3,
    margin: 2.5,
  },
  marker: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'transparent',
    width: 25,
    height: 25
  },
  backButton: {
    margin: 10,
    alignSelf: 'center',
  },
  backIcon:{
    height: 25,
    width: 15,
  },
  circle: {
    height: 25,
    width: 25,
    borderRadius: 25,
    backgroundColor: '#FA770B',
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  }
})