import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';  // Import hooks from Redux
import { STATUS } from '../../globals/status/status';
import { listAllWhiteList } from '../../store/whiteListSlice';

const WhiteList = () => {
  const dispatch = useDispatch();

  // Access the whitelist data and status from Redux state
  const { whiteList, status } = useSelector(state => state.whiteList);

  useEffect(() => {
    // Dispatch action to fetch whitelist data when the component mounts
    dispatch(listAllWhiteList());
  }, [dispatch]);

  console.log(whiteList);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My WhiteList</h2>
      {status === STATUS.LOADING && <p>Loading...</p>}
      {status === STATUS.ERROR && <p>Something went wrong. Please try again.</p>}

      {whiteList.length === 0 ? (
        <p>No books in the whitelist.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {whiteList.map(item => (
            <div
              key={item.whiteListId}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={item.coverImage}
                  alt={item.bookTitle}
                  style={{
                    width: '150px',
                    height: '225px',
                    borderRadius: '5px',
                    marginBottom: '10px'
                  }}
                />
                <div>
                  <strong style={{ fontSize: '18px', color: '#333' }}>{item.bookTitle}</strong>
                  <p style={{ fontStyle: 'italic', color: '#555' }}>by {item.bookAuthor}</p>
                  <span style={{ fontStyle: 'italic', color: '#555' }}>{item.genre} - {item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhiteList;
