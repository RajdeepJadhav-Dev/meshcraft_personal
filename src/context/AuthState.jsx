import React, { useState, useEffect } from 'react';
import authContext from './authContext';
import { set } from 'mongoose';

const AuthState = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [assetData, setAssetData] = useState({
    title: "", description: "", poly: "", price: "", modelUrl: "",
    walkModelUrls: [], software: "", softwareLogo: "", scaleX: "", scaleY: "",
    scaleZ: "", rotationX:
     "", rotationY: "", rotationZ: "", objects: "",
    vertices: "", edges: "", faces: "", triangles: "", thumbnailId: null,
    thumbnailPreview: '',
  });
  const [thumbnails, setThumbnails] = useState([]);
  const [editAssetData, setEditAssetData] = useState([]);

  const IS_LOCAL = process.env.NODE_ENV === 'development';

  const ASSET_FUNC_BASE_URL = IS_LOCAL ? "http://localhost:5000/assets" : "/.netlify/functions";

  const THUMBNAIL_FUNC_URL = IS_LOCAL ? "http://localhost:5000/thumbnail" : "/.netlify/functions/thumbnail";
  const THUMBNAIL_ID_FUNC_URL = IS_LOCAL ? "http://localhost:5000/thumbnail" : "/.netlify/functions/thumbnail-id";
  const THUMBNAIL_VIEW_FUNC_URL = IS_LOCAL ? "http://localhost:5000/thumbnail/view" : "/.netlify/functions/thumbnail-view";

  const getAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ASSET_FUNC_BASE_URL}/getAssets`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Fetch assets error:", errorData.message);
        setLoading(false); return [];
      }
      const data = await response.json();
      setLoading(false); return data || [];
    } catch (error) {
      console.error("Server error while fetching assets:", error);
      setLoading(false); return [];
    }
  };

  const createAsset = async (newAsset) => {
    try {
      const response = await fetch(`${ASSET_FUNC_BASE_URL}/createAsset`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAsset),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Create asset error:", errorData.message); return null;
      }
      const data = await response.json(); return data.asset;
    } catch (error) {
      console.error("Server error while creating asset:", error); return null;
    }
  };

  const deleteAsset = async (id) => {
    try {
      const response = await fetch(`${ASSET_FUNC_BASE_URL}/deleteAsset/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Delete asset error:", errorData.message); return false;
      }
      setEditAssetData((prevAssets) => prevAssets.filter((asset) => asset._id !== id));
      return true;
    } catch (error) {
      console.error("Server error while deleting asset:", error); return false;
    }
  };

  const updateAsset = async (id, updatedAsset) => {
    try {
      const response = await fetch(`${ASSET_FUNC_BASE_URL}/updateAsset/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAsset),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update asset error:", errorData.message); return null;
      }
      const data = await response.json();
      console.log("Asset updated successfully:", data.asset);
      setEditAssetData((prevAssets) =>
        prevAssets.map((asset) => asset._id === id ? { ...asset, ...data.asset } : asset)
      );
      setAssetData(prev => prev._id === id ? { ...prev, ...data.asset } : prev);
      return data.asset;
    } catch (error) {
      console.error("Server error while updating asset:", error); return null;
    }
  };

  const getThumbnails = async () => {
    console.log('[AuthState] Fetching thumbnails from:', THUMBNAIL_FUNC_URL);
    try {
      const res = await fetch(THUMBNAIL_FUNC_URL);
      console.log(`[AuthState] Response status for ${THUMBNAIL_FUNC_URL}: ${res.status} ${res.statusText}`);
      const rawText = await res.text();
      console.log('[AuthState] Raw response text:', rawText);
      if (!res.ok) {
        console.error('Error fetching thumbnails:', `Status ${res.status}, Body: ${rawText}`);
        return [];
      }
      try {
          const data = JSON.parse(rawText);
          return data || [];
      } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
          console.error('Response text that failed parsing:', rawText);
          return [];
      }
    } catch (error) {
      console.error('[AuthState] Network or other error fetching thumbnails:', error);
      return [];
    }
  };

  const uploadThumbnail = async (assetId, file) => {
    try {
      const formData = new FormData();
      formData.append('assetId', assetId);
      formData.append('imageFile', file);
      const res = await fetch(THUMBNAIL_FUNC_URL, { method: 'POST', body: formData });
      if (!res.ok) {
        const errData = await res.json();
        console.error('Error uploading thumbnail:', errData.error); return null;
      }
      const data = await res.json();
      console.log('Thumbnail created:', data.thumbnail);
      await loadAllData(); return data.thumbnail;
    } catch (error) {
      console.error('Error uploading thumbnail:', error); return null;
    }
  };

  const editThumbnail = async (thumbId, file) => {
    try {
      const formData = new FormData();
      formData.append('imageFile', file);
      const targetUrl = IS_LOCAL ? `${THUMBNAIL_ID_FUNC_URL}/${thumbId}` : `${THUMBNAIL_ID_FUNC_URL}?id=${thumbId}`;
      const res = await fetch(targetUrl, { method: 'PUT', body: formData });
      if (!res.ok) {
        const errData = await res.json();
        console.error('Error editing thumbnail:', errData.error); return null;
      }
      const data = await res.json();
      console.log('Thumbnail replaced:', data.thumbnail);
      await loadAllData(); return data.thumbnail;
    } catch (error) {
      console.error('Error editing thumbnail:', error); return null;
    }
  };

  const deleteThumbnail = async (thumbId) => {
    try {
      const targetUrl = IS_LOCAL ? `${THUMBNAIL_ID_FUNC_URL}/${thumbId}` : `${THUMBNAIL_ID_FUNC_URL}?id=${thumbId}`;
      const res = await fetch(targetUrl, { method: 'DELETE' });
      if (!res.ok && res.status !== 404) {
        console.error('Error deleting thumbnail:', await res.text()); return false;
      }
      console.log('Thumbnail doc deleted successfully or already gone');
      await loadAllData(); return true;
    } catch (error) {
      console.error('Error deleting thumbnail:', error); return false;
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    const assetsArray = await getAssets();
    const thumbsArray = await getThumbnails();
    const merged = assetsArray.map((asset) => {
      const thumbDoc = thumbsArray.find((t) => t.assetId === asset._id);
      let imageUrl = null;
      if (thumbDoc) {
          imageUrl = IS_LOCAL ? `${THUMBNAIL_VIEW_FUNC_URL}/${thumbDoc._id}` : `${THUMBNAIL_VIEW_FUNC_URL}?id=${thumbDoc._id}`;
      }
      return { ...asset, image: imageUrl, thumbnailId: thumbDoc ? thumbDoc._id : null };
    });
    setEditAssetData(merged);
    setThumbnails(thumbsArray);
    setLoading(false);
  };

  const loadAssetById = async (assetId) => {
    setLoading(true);
    let foundAsset = editAssetData.find(a => a._id === assetId);
    if (!foundAsset) {
        try {
            const response = await fetch(`${ASSET_FUNC_BASE_URL}/${assetId}`);
            if (!response.ok) {
                 console.error(`Asset ${assetId} not found or fetch error`);
                 setLoading(false); return;
            }
            foundAsset = await response.json();
            const allThumbs = await getThumbnails();
            const thumbDoc = allThumbs.find((t) => t.assetId === assetId);
            if (thumbDoc) {
                foundAsset.image = IS_LOCAL ? `${THUMBNAIL_VIEW_FUNC_URL}/${thumbDoc._id}` : `${THUMBNAIL_VIEW_FUNC_URL}?id=${thumbDoc._id}`;
                foundAsset.thumbnailId = thumbDoc._id;
            } else {
                foundAsset.image = null; foundAsset.thumbnailId = null;
            }
        } catch (error) {
            console.error('Error fetching single asset:', error);
            setLoading(false); return;
        }
    }
    setAssetData({
        title: foundAsset.title || "", description: foundAsset.description || "",
        poly: foundAsset.poly || "", price: foundAsset.price || "",
        modelUrl: foundAsset.modelUrl || "", walkModelUrls: foundAsset.walkModelUrls || [],
        software: foundAsset.software || "", softwareLogo: foundAsset.softwareLogo || "",
        scaleX: foundAsset.scale?.x || "", scaleY: foundAsset.scale?.y || "", scaleZ: foundAsset.scale?.z || "",
        rotationX: foundAsset.rotation?.x || "", rotationY: foundAsset.rotation?.y || "", rotationZ: foundAsset.rotation?.z || "",
        objects: foundAsset.objects || "", vertices: foundAsset.vertices || "",
        edges: foundAsset.edges || "", faces: foundAsset.faces || "", triangles: foundAsset.triangles || "",
        thumbnailId: foundAsset.thumbnailId || null, thumbnailPreview: foundAsset.image || '',
        _id: foundAsset._id
    });
    setLoading(false);
  };

  useEffect(() => { loadAllData(); }, []);

  return (
    <authContext.Provider value={{
        isSidebarOpen, setIsSidebarOpen, open, setOpen, assetData, setAssetData,
        editAssetData, thumbnails, previewSrc, setPreviewSrc, loading,
        loadAllData, loadAssetById, createAsset, deleteAsset, updateAsset,
        uploadThumbnail, editThumbnail, deleteThumbnail,
    }}>
      {props.children}
    </authContext.Provider>
  );
};

export default AuthState;