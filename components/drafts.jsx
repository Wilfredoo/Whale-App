
       {this.state.snapshot.val().map(data => {
    return (
      <div>
        <Marker 
        coordinate={{latitude: data.val().latitude, longitude: data.val().longitude}}
        title={data.name}
        >
      </div>
    )
              } )
    }