import React from 'react';
import Validation from './Validation';
import {Image, View, StyleSheet, Text, Dimensions} from 'react-native';
import Button from './Button';
import ValidationScreenTop from './ValidationScreenTop';
/* Takes in validation response and image as a prop
Validation Reponse form 
        {
          fileName: "Name",
          isClear: true,
          isBright: true,
          hasDog: true,
          isCentered: true,
          breed: "Dog"
        }

*/
export default class ValidationScreen extends React.Component {
    constructor(props){
        super(props)
    }
    

    render() {
      
      

        const dimensions = Dimensions.get('window');
        const imageHeight = Math.round(dimensions.height * 3/ 5);
        const imageWidth = dimensions.width;
        const headerHeight = Math.round(dimensions.height * .5/5);
        const validationHeight = Math.round(dimensions.height * 1/5)
      return (
      <View style ={styles.container}>
      <View style = {[styles.header, {height: headerHeight}]}>
      <ValidationScreenTop></ValidationScreenTop>
      </View>
     
      
      <View style = {styles.imageContainer}>
      <Image  style = {{height: imageHeight, width: imageWidth} } source={this.props.img} ></Image>
      </View>

      <View style = {{height: validationHeight, alignItems: 'flex-end', top: 30}}>
        <Validation validationResponse = {this.props.valRes}></Validation>
      </View>
      </View>
     
      
      
      
        
        
      );
        
    }
    
  }

  const styles = StyleSheet.create({
    // Slide styles
    
    imageContainer:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    },
    image:{
      height: 60,
      width: 500
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      margin: 15,
     
    },
    // Header styles
    header: {
      
    },
    
    
   });