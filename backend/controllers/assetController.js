const Asset = require('../models/Assets');

exports.getAssets = async (req, res) => {
    try {
        const assets = await Asset.find();
        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.createAsset = async (req, res) => {
    try {
        // Destructure fields from the request body
        const {
          title,
          description,
          extendedDescription,
          poly,
          price,
          modelUrl,
          walkModelUrls, // NEW field
          software,
          softwareLogo,
          scale,
          rotation,
          technical
        } = req.body;
    
        // Basic validation: require title, description, and technical
        if (!title || !description || !technical) {
          return res
            .status(400)
            .json({ message: "Title, description, and technical details are required" });
        }
    
        // Create a new asset
        const newAsset = new Asset({
          title,
          description,
          extendedDescription,
          poly,
          price,
          modelUrl,
          walkModelUrls, // include walkModelUrl
          software,
          softwareLogo,
          scale,
          rotation,
          technical
        });
    
        // Save to MongoDB
        await newAsset.save();
    
        res.status(201).json({ message: "3D asset created successfully", asset: newAsset });
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    };


exports.updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const {
          title,
          description,
          extendedDescription,
          poly,
          price,
          modelUrl,
          walkModelUrls,
          software,
          softwareLogo,
          scale,
          rotation,
          technical
        } = req.body;
    
        // Basic validation: require title, description, and technical
        if (!title || !description || !technical) {
          return res
            .status(400)
            .json({ message: "Title, description, and technical details are required" });
        }
    
        const asset = await Asset.findByIdAndUpdate(
          id,
          {
            title,
            description,
            extendedDescription,
            poly,
            price,
            modelUrl,
            walkModelUrls,
            software,
            softwareLogo,
            scale,
            rotation,
            technical
          },
          { new: true, runValidators: true }
        );
    
        if (!asset) {
          return res.status(404).json({ message: "Asset not found" });
        }
    
        res.status(200).json({ message: "Asset updated successfully", asset });
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    };

exports.deleteAsset = async (req, res) => {
    try {
      const { id } = req.params;

        const asset = await Asset.findByIdAndDelete(id);
    
        if (!asset) {
          return res.status(404).json({ message: "Asset not found" });
        }
    
        res.status(200).json({ message: "Asset deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    };

    