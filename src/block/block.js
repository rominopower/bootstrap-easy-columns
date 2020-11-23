/**
 * BLOCK: magic-numbers
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType, source  } = wp.blocks;
const { RichText, InspectorControls, InnerBlocks, withColors, PanelColorSettings, MediaUpload } = wp.editor;
const { PanelBody, TextControl, SelectControl, CheckboxControl, Button  } = wp.components;
// Import registerBlockType() from wp.blocks

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'col-bootstrap/columns', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Columns Bootstrap' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Cooltech' ),
	],
  attributes: {
    imgUrl: {
    type: 'string',
    default: 'http://placehold.it/300'
  },
    col1: {
      type:'string',
      default:'col-sm-6'
    },
    col2 : {
      type:'string',
      default:'col-sm-6'
    },
    bodyContent: {
      source: 'html',
      selector: '.copy-bd'
  },
    heading: {
      source: 'html',
      selector: '.copy-hd'
    },
    invert: {
      type:'boolean',
    },
    background_color: {
          type: 'string', // tag a
            default: 'white',
      },
},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
   edit(props) {
    const { className, setAttributes } = props;
    const { attributes } = props;

    var background_color=attributes.background_color
    var block_style = {
        backgroundColor: attributes.background_color
    }
    if(attributes.imgUrl!="http://placehold.it/300" && attributes.imgUrl!="" ) {
      var immagine=<img src={attributes.imgUrl}  />;
      var edit_img=	 <div><MediaUpload
            onSelect={selectImage}
            render={  ({open}) => {
                return <img
                    src={attributes.imgUrl}
                    onClick={open}
                    />;
            }}

            />
            <div className='remove-item' onClick={() => removeImage()}><span class="dashicons dashicons-trash"></span></div></div>
    } else {
      var immagine='';
      var edit_img =  <MediaUpload
        onSelect={selectImage }
        render={ ( { open } ) => (
          <Button onClick={ open }>
            Open Media Library
          </Button>
        ) }
      />;
    }

    function onChangeBgColor ( content ) {
      setAttributes({background_color: content})
     }

    // we create a function that will take the changes from RichText
    // and update the attributes
    function changeBodyContent(changes) {
        setAttributes({
            bodyContent: changes
        })
    }
    function selectImage(value) {
//    console.log(value);
      setAttributes({
          imgUrl: value.sizes.full.url,
        })
    }
    function removeImage() {
      setAttributes({
          imgUrl: '',
        })
    }

    function changeHeading(heading) {
        // using some nice js features instead of typing
        // { heading: heading }
        setAttributes({ heading });
    }

    function onChangeFirstColumn ( content ) {
             props.setAttributes({col1: content})
         }

    function onChangeSecondColumn ( content ) {
              props.setAttributes({col2: content})
        }

    function onChangeCheck(value) {
      console.log(value);
        if( value ) {
          console.log("is true");
            props.setAttributes({ invert: true })
            classefoto="right";
        } else {
            props.setAttributes({ invert: false })
            classefoto="";
        }
    }



    return [
        <InspectorControls>
            {/* Later, when we have customizable options we will add stuff here! */}
            <div
                style={{
                    padding: '1em 0',
                }}
            >
        <TextControl label="Classes Column 1"
              value={ attributes.col1 }
               onChange={ onChangeFirstColumn }
          />
          <TextControl label="Classes Column 2"
     value={ attributes.col2 }
     onChange={onChangeSecondColumn }
 />
      <CheckboxControl label="Invert" checked={attributes.invert} onChange={onChangeCheck} value={attributes.invert} />
      <PanelColorSettings title={ __( 'Color' ) } colorSettings={ [
              {
                  value:{background_color},
                  onChange: onChangeBgColor,
                  label: __( 'Background Color' ),
              },
          ] } >
           </PanelColorSettings>
            </div>
        </InspectorControls>,
        <div className={props.className} style={block_style}>
            <div className={"wp-block-media "+attributes.invert+"-right"}>

            {edit_img}

            </div>
            <div className="wp-block-text" >
                <RichText
                        className="copy-hd"
                        tagName="h2"
                        placeholder="Enter your heading"
                        value={attributes.heading}
                        onChange={changeHeading}
                        />
                {/* Content is replaced by this guy.
                We determin the class name and the html tag that
                we want it to show as. */}
                <RichText
                    className="copy-bd"
                    tagName="div"
                    placeholder="Enter your text here"
                    value={attributes.bodyContent}
                    onChange={changeBodyContent}
                    />
            </div>
              <div class="spacer" ></div>
        </div>,
    ];
},
save(props) {
  //  const className = getBlockDefaultClassName('guty/media-block');

    const { attributes } = props;

    var block_style = {
        backgroundColor: attributes.background_color
    }


    if(attributes.invert===true) {
      console.log("vero");
      var classe="order-2";
    } else {
      var classe="";
    }

    if(attributes.imgUrl!="http://placehold.it/300") {
      var immagine=<img src={attributes.imgUrl} class="mbe" />;
    } else {
      var immagine='';
    }

    return (
      <div style={block_style}>
        <div className="container">
          <div className="row">
            <div className={attributes.col1+" "+classe}>
              <div className="media">
                  {immagine}
              </div>
              </div>
          <div className={attributes.col2}>
            <div className="copy">
                <RichText.Content
                    class="copy-hd"
                    tagName="h2"
                    value={attributes.heading}
                    />
                <RichText.Content
                    className="copy-bd"
                    tagName="div"
                    value={attributes.bodyContent}
                    />
            </div>
          </div>
          </div>
        </div>
        </div>
    );
},
} );
