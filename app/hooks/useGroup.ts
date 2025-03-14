// hooks/useGroup.ts
import { useState, useCallback, useEffect } from 'react';

export function useGroup(groupId: string, userId: string | null) {
  const [groupName, setGroupName] = useState<string>("");
  const [group_image, setGroupImage] = useState<string>("");
  const [isMember, setIsMember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // グループ詳細情報の取得 - ローディング状態は外部で管理
  const fetchGroupDetail = useCallback(async () => {
    if (!groupId) return null;
    
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) throw new Error("グループ情報の取得に失敗しました");
      
      const data = await response.json();
      setGroupName(data.group.name);
      setGroupImage(data.group.image_url);
      setError(null);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("不明なエラー"));
      console.error("グループ詳細取得エラー:", err);
      return null;
    }
  }, [groupId]);

  // メンバーシップ状態の取得 - ローディング状態は外部で管理
  const fetchMembershipStatus = useCallback(async () => {
    if (!groupId || !userId) {
      // 未認証ユーザーはメンバーではない
      setIsMember(false);
      return null;
    }
    
    try {
      const response = await fetch(`/api/groups/join/?userId=${userId}&groupId=${groupId}`);
      if (!response.ok) throw new Error("メンバーシップ状態の取得に失敗しました");
      
      const data = await response.json();
      setIsMember(data.isMember);
      setError(null);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("不明なエラー"));
      console.error("メンバーシップ状態取得エラー:", err);
      return null;
    }
  }, [groupId, userId]);

  // グループへの参加
  const joinGroup = useCallback(async () => {
    if (!groupId || !userId) 
      


      return false;
    
    try {
      const response = await fetch(`/api/groups/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, groupId }),
      });
      
      if (!response.ok) throw new Error("グループへの参加に失敗しました");
      
      setIsMember(true);
      return true;
    } catch (error) {
      console.error("グループ参加エラー:", error);
      return false;
    }
  }, [groupId, userId]);

  // グループからの脱退
  const leaveGroup = useCallback(async () => {
    if (!groupId || !userId) return false;
    
    try {
      const response = await fetch(`/api/groups/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, groupId }),
      });
      
      if (!response.ok) throw new Error("グループからの脱退に失敗しました");
      
      setIsMember(false);
      return true;
    } catch (error) {
      console.error("グループ脱退エラー:", error);
      return false;
    }
  }, [groupId, userId]);

  // 初回レンダリング時に情報取得
  useEffect(() => {
    const loadGroupData = async () => {
      setLoading(true); 
      try {
    
        const detailPromise = fetchGroupDetail();
        const membershipPromise = fetchMembershipStatus();
        
     
        await Promise.all([detailPromise, membershipPromise]);
      } catch (err) {
        console.error("グループデータ取得エラー:", err);
      } finally {
  
        setLoading(false);
      }
    };
    
    if (groupId) {
      loadGroupData();
    } else {
      setLoading(false); // groupIdがない場合はローディングを終了
    }
  }, [groupId, userId, fetchGroupDetail, fetchMembershipStatus]);

  return {
    groupName,
    group_image,
    isMember,
    loading,
    error,
    joinGroup,
    leaveGroup,
    refreshGroup: async () => {
      setLoading(true);
      
      try {
        await fetchGroupDetail();
        if (userId) await fetchMembershipStatus();
      } finally {
        setLoading(false);
      }
    }
  };
}